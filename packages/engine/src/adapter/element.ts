import Base from './base';
import { each, isEqual, isFunction, isNumber, isObject, noop, upperFirst } from '@antv/util';
import { ext } from '@antv/matrix-util';
import { IShape, IGroup, ICanvas } from './interfaces';
import { ClipCfg, OnFrame, AnimateCfg, BBox, ElementFilterFn } from './types';
import { Animation } from '@antv/g';
import { ADAPTER_ELE_PROPER_NAME } from './utils';
import { createDisplayObj, filterEmptyAttributes } from './displayObjs';
import { AdapterHammer } from './event';

const { transform } = ext;

// 可以在 toAttrs 中设置，但不属于绘图属性的字段
const RESERVED_PORPS = ['repeat'];
const SHAPE_MAP = {};

function getFormatToAttrs(props, shape) {
  const toAttrs = {};
  const attrs = shape.attr();
  each(props, (v, k) => {
    if (RESERVED_PORPS.indexOf(k) === -1 && !isEqual(attrs[k], v)) {
      toAttrs[k] = v;
    }
  });
  return toAttrs;
}

function getFormatFromAttrs(toAttrs, shape) {
  const fromAttrs = {};
  const attrs = shape.attrs;
  for (const k in toAttrs) {
    fromAttrs[k] = attrs[k];
  }
  return fromAttrs;
}

class Element extends Base {
  adapterHammer = null;

  get attrs() {
    return this.adapteredEle?.attributes;
  }

  getDefaultCfg() {
    return {
      visible: true,
      capture: true,
      zIndex: 0,
      children: [],
    };
  }

  getParent(): IGroup {
    return this.get('parent');
  }

  getCanvas(): ICanvas {
    return this.get('canvas');
  }

  set(name, value) {
    super.set(name, value);
    switch (name) {
      case 'capture':
        this.adapteredEle.interactive = value;
        break;
      case 'visible':
        if (value === true) {
          this.adapteredEle.setAttribute('visibility', 'hidden');
        } else {
          this.adapteredEle.setAttribute('visibility', 'visible');
        }
        break;
      case 'zIndex':
        this.adapteredEle.style[name] = value;
        break;
    }
  }

  attr(...args) {
    // 属性读取
    if (args.length === 0) {
      // @ts-ignore
      return this.adapteredEle.attr(...args);
    }
    // 属性读取
    if (args.length === 1 && typeof args[0] === 'string') {
      if (args[0] === 'matrix') {
        return this.getMatrix();
      }
      // @ts-ignore
      return this.adapteredEle.attr(...args);
    }
    // 属性设置
    let attrs = {};
    if (args.length === 2 && typeof args[0] === 'string') {
      attrs[args[0]] = args[1];
    }
    if (args.length === 1 && typeof args[0] === 'object') {
      attrs = filterEmptyAttributes(args[0]);
    }
    const matrix = attrs['matrix'];
    if (matrix) {
      delete attrs['matrix'];
    }
    this.adapteredEle.attr(attrs);
    if (matrix) {
      this.setMatrix(matrix);
    }
  }

  calcBBox() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const stack = [this];
    while (stack.length) {
      const ele = stack.pop();
      if (ele.get('type') !== 'group' && ele.get('type') !== 'Group' && !ele.isCanvas()) {
        const gBBox = ele.adapteredEle.getLocalBounds();
        let { lineWidth = 0 } = ele.adapteredEle.style;

        if (!ele.attr('stroke')) {
          lineWidth = 0;
        }
        const halfLineWidth = lineWidth / 2;
        const [gMinX, gMinY] = gBBox.getMin();
        const [gMaxX, gMaxY] = gBBox.getMax();

        minX = Math.min(minX, gMinX - halfLineWidth);
        maxX = Math.max(maxX, gMaxX + halfLineWidth);
        minY = Math.min(minY, gMinY - halfLineWidth);
        maxY = Math.max(maxY, gMaxY + halfLineWidth);
      }
      stack.push(...ele.get('children'));
    }
    return {
      x: minX,
      y: minY,
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  calcCanvasBBox() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const stack = [this];
    while (stack.length) {
      const ele = stack.pop();
      if (ele.get('type') !== 'group' && ele.get('type') !== 'Group' && !ele.isCanvas()) {
        const gBBox = ele.adapteredEle.getRenderBounds();
        const [gMinX, gMinY] = gBBox.getMin();
        const [gMaxX, gMaxY] = gBBox.getMax();

        minX = Math.min(minX, gMinX);
        maxX = Math.max(maxX, gMaxX);
        minY = Math.min(minY, gMinY);
        maxY = Math.max(maxY, gMaxY);
      }
      stack.push(...ele.get('children'));
    }
    return {
      x: minX,
      y: minY,
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  // 在子类上单独实现
  getBBox(): BBox {
    return this.calcBBox();
  }
  // 子类上单独实现
  getCanvasBBox(): BBox {
    return this.calcCanvasBBox();
  }

  show() {
    this.adapteredEle.show();
    this.set('visible', this.adapteredEle.style.visibility === 'visible');
    return this;
  }

  hide() {
    // 不是高频操作直接使用 set
    this.adapteredEle.hide();
    this.set('visible', this.adapteredEle.style.visibility === 'visible');
    return this;
  }

  setZIndex(zIndex: number) {
    this.set('zIndex', zIndex);
    return this;
  }

  toFront() {
    this.adapteredEle.toFront();
    this.set('zIndex', this.adapteredEle.style.zIndex);
    return this;
  }

  toBack() {
    this.adapteredEle.toBack();
    this.set('zIndex', this.adapteredEle.style.zIndex);
    return this;
  }

  remove(destroy = true) {
    this.adapteredEle.remove(destroy);
    const children = this.get('parent').getChildren();
    children.splice(children.indexOf(this), 1);
    if (destroy) {
      this.destroyed = true;
      this.set('destroyed', true);
    }
  }

  resetMatrix() {
    this.adapteredEle.resetLocalTransform();
  }

  getMatrix(): number[] {
    const rotation = (this.adapteredEle.getLocalEulerAngles() * Math.PI) / 180;
    const [sx, sy] = this.adapteredEle.getLocalScale();
    const [tx, ty] = this.adapteredEle.getLocalPosition();

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    return [sx * cos, sy * sin, 0, -sx * sin, sy * cos, 0, tx, ty, 1];
  }

  setMatrix(mat: number[]) {
    let row0x = mat[0];
    let row0y = mat[3];
    let row1x = mat[1];
    let row1y = mat[4];
    // decompose 3x3 matrix
    // @see https://www.w3.org/TR/css-transforms-1/#decomposing-a-2d-matrix
    let scalingX = Math.sqrt(row0x * row0x + row0y * row0y);
    let scalingY = Math.sqrt(row1x * row1x + row1y * row1y);

    // If determinant is negative, one axis was flipped.
    const determinant = row0x * row1y - row0y * row1x;
    if (determinant < 0) {
      // Flip axis with minimum unit vector dot product.
      if (row0x < row1y) {
        scalingX = -scalingX;
      } else {
        scalingY = -scalingY;
      }
    }

    // Renormalize matrix to remove scale.
    if (scalingX) {
      row0x *= 1 / scalingX;
      row0y *= 1 / scalingX;
    }
    if (scalingY) {
      row1x *= 1 / scalingY;
      row1y *= 1 / scalingY;
    }

    // Compute rotation and renormalize matrix.
    const angle = (Math.atan2(row0y, row0x) * 180) / Math.PI;

    this.adapteredEle.setLocalScale(scalingX, scalingY);
    this.adapteredEle.setLocalPosition(mat[6], mat[7]);
    this.adapteredEle.setLocalEulerAngles(-angle);
  }

  getTotalMatrix() {
    const matrix = this.adapteredEle.getMatrix();
    return Array.from(matrix);
  }

  setClip(clipCfg: ClipCfg) {
    let clipShape = null;
    if (clipCfg) {
      clipShape = this.createEle(clipCfg);
      this.adapteredEle.setClip(clipShape.adapteredEle);
    }
    this.set('clipShape', clipShape);
    return clipShape;
  }

  getClip(): IShape {
    // 高频率调用的地方直接使用 this.cfg.xxx
    const clipShape = this.get('clipShape');
    // 未设置时返回 Null，保证一致性
    if (!clipShape) {
      return null;
    }
    return clipShape;
  }

  clone() {
    const tree = this.createEle({ ...this.cfg, attrs: this.attrs, children: [], parent: null });
    const stack = [[this, tree]];
    while (stack.length) {
      const [origin, parent] = stack.pop();
      origin.getChildren().forEach((child) => {
        const ele = this.createEle({ ...child.cfg, attrs: child.attrs, children: [] });
        parent.add(ele);
        stack.push([child, ele]);
      });
    }
    return tree;
  }

  destroy() {
    this.adapteredEle.destroy();
    this.adapterHammer.removeAllListeners();
    this.destroyed = true;
    this.set('destroyed', true);
  }

  /**
   * 是否处于动画暂停状态
   * @return {boolean} 是否处于动画暂停状态
   */
  isAnimatePaused() {
    return this.get('_pause').isPaused;
  }

  /**
   * 执行动画，支持多种函数签名
   * 1. animate(toAttrs: ElementAttrs, duration: number, easing?: string, callback?: () => void, delay?: number)
   * 2. animate(onFrame: OnFrame, duration: number, easing?: string, callback?: () => void, delay?: number)
   * 3. animate(toAttrs: ElementAttrs, cfg: AnimateCfg)
   * 4. animate(onFrame: OnFrame, cfg: AnimateCfg)
   * 各个参数的含义为:
   *   toAttrs  动画最终状态
   *   onFrame  自定义帧动画函数
   *   duration 动画执行时间
   *   easing   动画缓动效果
   *   callback 动画执行后的回调
   *   delay    动画延迟时间
   */
  animate(...args) {
    this.set('animating', true);
    const animations = this.get('animations') || [];
    let [toAttrs, duration, easing = 'easeLinear', callback = noop, delay = 0] = args;
    let onFrame: OnFrame;
    let repeat: boolean;
    let pauseCallback;
    let resumeCallback;
    let animateCfg: AnimateCfg;
    // 第二个参数，既可以是动画最终状态 toAttrs，也可以是自定义帧动画函数 onFrame
    if (isFunction(toAttrs)) {
      onFrame = toAttrs as OnFrame;
      toAttrs = {};
    } else if (isObject(toAttrs) && (toAttrs as any).onFrame) {
      // 兼容 3.0 中的写法，onFrame 和 repeat 可在 toAttrs 中设置
      onFrame = (toAttrs as any).onFrame as OnFrame;
      repeat = (toAttrs as any).repeat;
    }
    // 第二个参数，既可以是执行时间 duration，也可以是动画参数 animateCfg
    if (isObject(duration)) {
      animateCfg = duration as AnimateCfg;
      duration = animateCfg.duration;
      easing = animateCfg.easing || 'easeLinear';
      delay = animateCfg.delay || 0;
      // animateCfg 中的设置优先级更高
      repeat = animateCfg.repeat || repeat || false;
      callback = animateCfg.callback || noop;
      pauseCallback = animateCfg.pauseCallback || noop;
      resumeCallback = animateCfg.resumeCallback || noop;
    } else {
      // 第四个参数，既可以是回调函数 callback，也可以是延迟时间 delay
      if (isNumber(callback)) {
        delay = callback;
        callback = null;
      }
      // 第三个参数，既可以是缓动参数 easing，也可以是回调函数 callback
      if (isFunction(easing)) {
        callback = easing;
        easing = 'easeLinear';
      } else {
        easing = easing || 'easeLinear';
      }
    }
    const formatToAttrs = getFormatToAttrs(toAttrs, this);
    const animation = this.adapteredEle.animate(
      [filterEmptyAttributes(getFormatFromAttrs(formatToAttrs, this)), formatToAttrs],
      {
        duration,
        easing,
        iterations: repeat ? Infinity : 1,
        delay,
      }
    );

    animation.onframe = (e) => {
      const animation = e.target;
      const computedTiming = (animation as Animation).effect.getComputedTiming();
      onFrame && onFrame(computedTiming.progress);
    };

    animation.onfinish = () => {
      callback && callback();
    };

    // @ts-ignore
    animation._onAdapterPause = pauseCallback;
    // @ts-ignore
    animation._onResumePause = resumeCallback;

    animations.push(animation);
    this.set('animations', animations);
  }

  /**
   * 停止动画
   * @param {boolean} toEnd 是否到动画的最终状态
   */
  stopAnimate() {
    const animations = this.get('animations');
    each(animations, (animation) => {
      // 将动画执行到最后一帧
      animation.finish();
    });
    this.set('animating', false);
    this.set('animations', []);
  }

  /**
   * 暂停动画
   */
  pauseAnimate() {
    // const timeline = this.get('timeline');
    const animations = this.get('animations');
    // const pauseTime = timeline.getTime();
    each(animations, (animation: Animation) => {
      animation.pause();
      // @ts-ignore
      animation._onAdapterPause?.();
    });
    return this;
  }

  /**
   * 恢复动画
   */
  resumeAnimate() {
    const animations = this.get('animations');
    // 之后更新属性需要计算动画已经执行的时长，如果暂停了，就把初始时间调后
    each(animations, (animation: Animation) => {
      animation.play();
      // @ts-ignore
      animation._onResumePause?.();
    });

    this.set('animations', animations);
    return this;
  }

  /**
   * 移动元素
   * @param {number} translateX 水平移动距离
   * @param {number} translateY 垂直移动距离
   * @return {Element} 元素
   */
  translate(translateX: number = 0, translateY: number = 0) {
    return this.adapteredEle.translateLocal(translateX, translateY);
  }

  /**
   * 移动元素到目标位置
   * @param {number} targetX 目标位置的水平坐标
   * @param {number} targetX 目标位置的垂直坐标
   * @return {Element} 元素
   */
  move(targetX: number, targetY: number) {
    const x = this.attr('x') || 0;
    const y = this.attr('y') || 0;
    this.translate(targetX - (x as number), targetY - (y as number));
    return this;
  }

  /**
   * 移动元素到目标位置，等价于 move 方法。由于 moveTo 的语义性更强，因此在文档中推荐使用 moveTo 方法
   * @param {number} targetX 目标位置的 x 轴坐标
   * @param {number} targetY 目标位置的 y 轴坐标
   * @return {Element} 元素
   */
  moveTo(targetX: number, targetY: number) {
    return this.move(targetX, targetY);
  }

  /**
   * 缩放元素
   * @param {number} ratioX 水平缩放比例
   * @param {number} ratioY 垂直缩放比例
   * @return {Element} 元素
   */
  scale(ratioX: number, ratioY?: number) {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [['s', ratioX, ratioY || ratioX]]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 以画布左上角 (0, 0) 为中心旋转元素
   * @param {number} radian 旋转角度(弧度值)
   * @return {Element} 元素
   */
  rotate(radian: number) {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [['r', radian]]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 以起始点为中心旋转元素
   * @param {number} radian 旋转角度(弧度值)
   * @return {Element} 元素
   */
  rotateAtStart(rotate: number): Element {
    const { x, y } = this.attrs;
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [
      ['t', -x, -y],
      ['r', rotate],
      ['t', x, y],
    ]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 以任意点 (x, y) 为中心旋转元素
   * @param {number} radian 旋转角度(弧度值)
   * @return {Element} 元素
   */
  rotateAtPoint(x: number, y: number, rotate: number): Element {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [
      ['t', -x, -y],
      ['r', rotate],
      ['t', x, y],
    ]);
    this.setMatrix(newMatrix);
    return this;
  }

  isCanvas() {
    return false;
  }

  createEle(cfg) {
    const { type } = cfg;
    let shapeType = SHAPE_MAP[type];
    if (!shapeType) {
      shapeType = upperFirst(type);
    }
    SHAPE_MAP[cfg.type] = shapeType;
    const element = new Element(cfg);
    element.adapteredEle = createDisplayObj(shapeType, cfg);
    element.adapteredEle[ADAPTER_ELE_PROPER_NAME] = element;
    element.adapterHammer = new AdapterHammer(element.adapteredEle);
    return element;
  }

  addShape(...args): Element {
    const type = args[0];
    let cfg = args[1];
    if (isObject(type)) {
      cfg = type;
    } else {
      cfg['type'] = type;
    }
    const element = this.createEle(cfg);
    this.add(element);
    return element;
  }

  addGroup(...args): Element {
    const [cfg] = args;
    const group = this.createEle({
      type: 'Group',
      ...cfg,
    });
    this.add(group);
    return group;
  }

  add(element: Element) {
    element.set('parent', this);
    this.adapteredEle.add(element.adapteredEle);
    this.getChildren().push(element);
  }

  getChildren(): Element[] {
    return this.get('children');
  }

  clear() {
    this.set('clearing', true);
    if (this.destroyed) {
      return;
    }
    this.adapteredEle.removeChildren();
    this.set('children', []);
    this.set('clearing', false);
  }

  /**
   * 获取第一个子元素
   * @return {Element} 第一个元素
   */
  getFirst(): Element {
    return this.getChildByIndex(0);
  }

  /**
   * 获取最后一个子元素
   * @return {Element} 元素
   */
  getLast(): Element {
    const children = this.getChildren();
    return this.getChildByIndex(children.length - 1);
  }

  /**
   * 根据索引获取子元素
   * @return {Element} 第一个元素
   */
  getChildByIndex(index: number): Element {
    const children = this.getChildren();
    return children[index];
  }

  /**
   * todo 子元素的数量
   * @return {number} 子元素数量
   */
  getCount(): number {
    const children = this.getChildren();
    return children.length;
  }

  /**
   * todo 是否包含对应元素
   * @param {Element} element 元素
   * @return {boolean}
   */
  contain(element: Element): boolean {
    const children = this.getChildren();
    return children.indexOf(element) > -1;
  }

  /**
   * todo 移除对应子元素
   * @param {Element} element 子元素
   * @param {boolean} destroy 是否销毁子元素，默认为 true
   */
  removeChild(element: Element, destroy = true) {
    if (this.contain(element)) {
      element.remove(destroy);
    }
  }

  /**
   * todo 查找元素，找到第一个返回
   * @param  {ElementFilterFn} fn    匹配函数
   * @return {Element|null} 元素，可以为空
   */
  find(fn: ElementFilterFn): Element {
    let rst: Element = null;
    const children = this.getChildren();
    each(children, (element) => {
      if (fn(element)) {
        rst = element;
      } else {
        rst = element.find(fn);
      }
      if (rst) {
        return false;
      }
    });
    return rst;
  }

  /**
   * 根据 ID 查找元素
   * @param {string} id 元素 id
   * @return {Element|null} 元素
   */
  findById(id: string): Element {
    return this.find((element) => {
      return element.get('id') === id;
    });
  }

  getPoint(ratio) {
    // @ts-ignore
    return this.adapteredEle.getPoint(ratio);
  }

  getStartTangent() {
    // @ts-ignore
    return this.adapteredEle.getStartTangent();
  }

  getEndTangent() {
    // @ts-ignore
    return this.adapteredEle.getEndTangent();
  }

  getTotalLength(ratio) {
    // @ts-ignore
    return this.adapteredEle.getTotalLength(ratio);
  }

  on(evt: string, callback: Function, once?: boolean): this {
    this.adapterHammer.on(evt, callback, once);
    return this;
  }
  off(evt?: string, callback?: Function): this {
    this.adapterHammer.off(evt, callback);
    return this;
  }

  emit(...args) {
    this.adapterHammer.emit(...args);
  }
  removeAllListeners(...args) {
    this.adapterHammer.removeAllListeners(...args);
  }

  applyMatrix() {}

  sort() {}
}

export default Element;

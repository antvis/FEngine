import { isFunction } from '@antv/util';
import Component from '../component';
import equal from './equal';
import { Group, Text, Canvas as GCanvas, CanvasLike } from '@antv/g-lite';
import { createMobileCanvasElement } from '@antv/g-mobile-canvas-element';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import { createUpdater, Updater } from '../component/updater';
import EE from '@antv/event-emitter';
import Theme, { Theme as ThemeType } from './theme';
import { px2hd as defaultPx2hd, checkCSSRule, batch2hd } from './util';
import Gesture from '../gesture';
import { render, updateComponents, destroyElement } from './render';
import { VNode } from './vnode';
import { IProps, IContext, TextStyleProps } from '../types';
import { ClassComponent } from './workTags';

export interface CanvasProps extends IProps {
  context?: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  pixelRatio?: number;
  padding?: number | string | (number | string)[];
  animate?: boolean;
  children?: any;
  px2hd?: any;
  theme?: ThemeType;
  style?: any;
  container?: any;
  renderer?: any;
  landscape?: boolean;
  createImage?: (src?: string) => HTMLImageElement;
}

function measureText(container: Group, px2hd, theme: ThemeType) {
  return (text: string, font?) => {
    const {
      fontSize = theme.fontSize,
      fontFamily = theme.fontFamily,
      fontWeight = theme.fontWeight,
      fontVariant = theme.fontVariant,
      fontStyle = theme.fontStyle,
      textAlign = theme.textAlign,
      textBaseline = theme.textBaseline,
      lineWidth = 1,
    } = font || {};

    const style = {
      x: 0,
      y: 0,
      fontSize: px2hd(fontSize),
      fontFamily: fontFamily,
      fontStyle,
      fontWeight,
      fontVariant,
      text: text,
      textAlign,
      textBaseline,
      lineWidth,
      visibility: 'hidden',
    };

    const result = checkCSSRule('text', style) as TextStyleProps;
    const shape = new Text({ style: result });

    container.appendChild(shape);
    const { width, height } = shape.getBBox();

    shape.remove();
    return {
      width,
      height,
    };
  };
}

function computeLayout(style) {
  const { left, top, width, height, padding } = style;
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = padding;
  return {
    left: left + paddingLeft,
    top: top + paddingTop,
    width: width - paddingLeft - paddingRight,
    height: height - paddingTop - paddingBottom,
  };
}

// 顶层Canvas标签
class Canvas<P extends CanvasProps = CanvasProps> {
  props: P;
  private updater: Updater;
  private theme: ThemeType;
  private gesture: Gesture;
  private canvas: GCanvas;
  private _ee: EE;
  container: Group;
  context: IContext;
  children: VNode | VNode[] | null;
  private vNode: VNode;
  landscape: boolean;
  canvasElement: CanvasLike;

  constructor(props: P) {
    const {
      context,
      renderer = new CanvasRenderer(),
      width,
      height,
      theme: customTheme,
      px2hd: customPx2hd,
      pixelRatio: customPixelRatio,
      landscape,
      container: rendererContainer,
      style: customStyle,
      animate = true,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
    } = props;

    const px2hd = isFunction(customPx2hd) ? batch2hd(customPx2hd) : defaultPx2hd;
    // 初始化主题
    const theme = px2hd({ ...Theme, ...customTheme }) as ThemeType;
    const { pixelRatio, fontSize, fontFamily, padding } = theme;
    const devicePixelRatio = customPixelRatio ? customPixelRatio : pixelRatio;

    // 组件更新器
    const updater = createUpdater(this);

    const canvasElement = createMobileCanvasElement(context);
    const canvas = new GCanvas({
      container: rendererContainer,
      canvas: canvasElement,
      devicePixelRatio,
      renderer,
      width,
      height,
      supportsTouchEvents: true,
      supportsPointerEvents: true,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
    });

    const container = canvas.getRoot();
    const { width: canvasWidth, height: canvasHeight } = canvas.getConfig();
    const style = px2hd({
      left: 0,
      top: 0,
      width: canvasWidth,
      height: canvasHeight,
      padding,
      ...customStyle,
    });
    const layout = computeLayout(style);

    // 设置默认的全局样式
    const documentElement = canvas.document.documentElement;
    documentElement.setAttribute('fontSize', fontSize);
    documentElement.setAttribute('fontFamily', fontFamily);

    // 设置 container 的位置
    container.setAttribute('x', layout.left);
    container.setAttribute('y', layout.top);

    const gesture = new Gesture(canvas);

    // 供全局使用的一些变量
    const componentContext = {
      root: this,
      canvas,
      left: layout.left,
      top: layout.top,
      width: layout.width,
      height: layout.height,
      px2hd,
      theme,
      gesture,
      measureText: measureText(container, px2hd, theme),
    };

    const vNode: VNode = {
      key: undefined,
      tag: ClassComponent,
      style: layout,
      // @ts-ignore
      type: Canvas,
      props,
      shape: container,
      animate,
      // @ts-ignore
      component: this,
      canvas: this,
      context: componentContext,
      updater,
    };

    this._ee = new EE();
    this.props = props;
    this.context = componentContext;
    this.updater = updater;
    this.gesture = gesture;
    this.theme = theme;
    this.canvas = canvas;
    this.container = container;
    this.canvasElement = canvasElement;
    this.vNode = vNode;
    // todo: 横屏事件逻辑
    this.landscape = landscape;
  }

  updateComponents(components: Component[]) {
    updateComponents(components);
  }

  async update(nextProps: P) {
    const { props, vNode } = this;
    if (equal(nextProps, props)) {
      return;
    }

    const { animate = true } = props;

    this.props = nextProps;
    vNode.props = nextProps;
    vNode.animate = animate;
    await this.render();
  }

  async render() {
    const { canvas, vNode } = this;
    await canvas.ready;

    render(vNode);
  }

  emit(type: string, event) {
    this._ee.emit(type, event);
  }

  on(type: string, listener) {
    this._ee.on(type, listener);
  }

  off(type: string, listener?) {
    this._ee.off(type, listener);
  }

  getCanvasEl() {
    return this.canvasElement;
  }

  resize(width: number, height: number) {
    const { canvas } = this;
    canvas.resize(width, height);
  }

  toRawChildren(children) {
    return children;
  }

  destroy() {
    const { canvas, children } = this;

    // 销毁也需要等 ready
    canvas.ready.then(() => {
      canvas.destroy();
    });

    destroyElement(children);
    this.props = null;
    this.context = null;
    this.updater = null;
    this.theme = null;
    this.canvas = null;
    this.container = null;
    this.canvasElement = null;
    this.vNode = null;
  }
}

export default Canvas;

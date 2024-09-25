import { isFunction } from '@antv/util';
import Component from '../component';
import equal from './equal';
import {
  Group,
  Text,
  Canvas as GCanvas,
  CanvasLike,
  IRenderer,
  runtime,
  DataURLType,
} from '@antv/g-lite';
import { createMobileCanvasElement } from '@antv/g-mobile-canvas-element';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import { createUpdater, Updater } from '../component/updater';
import EE from 'eventemitter3';
import Theme, { Theme as ThemeType } from './theme';
import { px2hd as defaultPx2hd, checkCSSRule, batch2hd } from './util';
import Gesture from '../gesture';
import { render, updateComponents, destroyElement } from './render';
import { VNode } from './vnode';
import { IProps, IContext, TextStyleProps } from '../types';
import { ClassComponent } from './workTags';
// 添加动画模块
import '@antv/g-web-animations-api';

export interface CanvasProps extends IProps {
  context?: CanvasRenderingContext2D | WebGLRenderingContext | null;
  container?: HTMLElement;
  renderer?: IRenderer;
  width?: number;
  height?: number;
  pixelRatio?: number;
  padding?: number | string | (number | string)[];
  animate?: boolean;
  children?: any;
  px2hd?: any;
  theme?: ThemeType;
  style?: any;
  landscape?: boolean;
  createImage?: (src?: string) => HTMLImageElement;
  offscreenCanvas?: CanvasLike;
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
  el: CanvasLike;

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
      // style: customStyle,
      animate = true,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
      offscreenCanvas,
      isTouchEvent,
      isMouseEvent,
      useNativeClickEvent = true,
    } = props;

    const px2hd = isFunction(customPx2hd) ? batch2hd(customPx2hd) : defaultPx2hd;
    // 初始化主题
    const theme = px2hd({ ...Theme, ...customTheme }) as ThemeType;
    const { pixelRatio, fontSize, fontFamily } = theme;
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
      // https://caniuse.com/?search=PointerEvent ios 13 以下不支持 Pointer
      supportsPointerEvents: runtime.globalThis.PointerEvent ? true : false,
      // 允许在canvas外部触发
      alwaysTriggerPointerEventOnCanvas: true,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
      useNativeClickEvent,
      offscreenCanvas,
      isTouchEvent,
      isMouseEvent,
    });

    const container = canvas.getRoot();
    const { width: canvasWidth, height: canvasHeight } = canvas.getConfig();

    // 设置默认的全局样式
    container.setAttribute('fontSize', fontSize);
    container.setAttribute('fontFamily', fontFamily);

    const gesture = new Gesture(container);

    // 供全局使用的一些变量
    const componentContext = {
      ctx: context,
      root: this,
      canvas,
      px2hd,
      theme,
      gesture,
      measureText: measureText(container, px2hd, theme),
      timeline: null,
    };

    const vNode: VNode = {
      key: undefined,
      tag: ClassComponent,
      // style: layout,
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
    this.el = canvasElement;
    this.vNode = vNode;
    // todo: 横屏事件逻辑
    this.landscape = landscape;

    this.updateLayout({ ...props, width: canvasWidth, height: canvasHeight });
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
    const { canvas, vNode, props } = this;
    const { onRender } = props;
    await canvas.ready;
    onRender && canvas.addEventListener('rerender', () => onRender(canvas), { once: true });
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
    return this.el;
  }

  async resize(width: number, height: number) {
    const { canvas } = this;
    canvas.resize(width, height);
    this.updateLayout({ ...this.props, width, height });
    await this.render();
  }

  async toDataURL(type?: DataURLType, encoderOptions?: number) {
    const { canvas } = this;
    return new Promise<string>((resolve) => {
      canvas.addEventListener(
        'rerender',
        () => {
          canvas
            .getContextService()
            .toDataURL({ type, encoderOptions })
            .then(resolve);
        },
        { once: true },
      );
    });
  }

  updateLayout(props) {
    const { width, height } = props;
    const { px2hd, theme } = this.context;
    const style = px2hd({
      left: 0,
      top: 0,
      width,
      height,
      padding: theme.padding,
      ...props.style,
    });
    const layout = computeLayout(style);
    const { left, top } = layout;
    // 设置 container 的位置
    this.container.setAttribute('x', left);
    this.container.setAttribute('y', top);

    this.context = {
      ...this.context,
      left,
      top,
      width: layout.width,
      height: layout.height,
    };
    this.vNode = {
      ...this.vNode,
      style: layout,
      context: this.context,
    };
  }

  toRawChildren(children) {
    return children;
  }

  destroy() {
    const { canvas, children, el } = this;
    destroyElement(children);
    // 需要清理 canvas 画布内容，否则会导致 spa 应用 ios 下 canvas 白屏
    // https://stackoverflow.com/questions/52532614/total-canvas-memory-use-exceeds-the-maximum-limit-safari-12
    // https://github.com/antvis/F2/issues/630
    el.width = 0;
    el.height = 0;

    this.props = null;
    this.context = null;
    this.updater = null;
    this.theme = null;
    this.canvas = null;
    this.container = null;
    this.el = null;
    this.vNode = null;

    // 销毁也需要等 ready
    canvas.ready.then(() => {
      canvas.destroy();
    });
  }
}

export default Canvas;

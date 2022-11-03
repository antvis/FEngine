import { deepMix, isFunction } from '@antv/util';
import Component from '../component';
import equal from './equal';
import { Group, Text, Canvas as GCanvas } from '@antv/g-lite';
import { createMobileCanvasElement } from '@antv/g-mobile-canvas-element';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import { createUpdater, Updater } from '../component/updater';
import EE from '@antv/event-emitter';
import defaultTheme, { Theme } from './theme';
import Layout from './layout';
import { px2hd as defaultPx2hd, checkCSSRule, batch2hd } from './util';
import Gesture from '../gesture';
import { render, updateComponents } from './render';
import { VNode } from './vnode';
import { IProps } from '../types';

export interface CanvasProps extends IProps {
  context?: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  pixelRatio?: number;
  padding?: number | string | (number | string)[];
  animate?: boolean;
  children?: any;
  px2hd?: any;
  theme?: Theme;
  style?: any;
  container?: any;
  renderer?: any;
  createImage?: (src?: string) => HTMLImageElement;
  landscape?: boolean;
}

export interface ComponentContext {
  [key: string]: any;
}

function measureText(container: Group, px2hd, theme) {
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

    const result = checkCSSRule('text', style);
    // @ts-ignore
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

// 顶层Canvas标签
class Canvas<P extends CanvasProps = CanvasProps> {
  props: P;
  private updater: Updater;
  private theme: Theme;
  private gesture: Gesture;
  private canvas: GCanvas;
  private _ee: EE;
  private container: Group;
  private context: any;

  private children: any;
  private vNode: VNode;
  layout: Layout;
  landscape: boolean;
  canvasElement: any;

  constructor(props: P) {
    const {
      context,
      renderer = new CanvasRenderer(),
      width,
      height,
      theme: customTheme,
      px2hd: customPx2hd,
      pixelRatio,
      createImage,
      landscape,
      container: rendererContainer,
      style: customStyle,
      animate = true,
    } = props;

    const px2hd = isFunction(customPx2hd) ? batch2hd(customPx2hd) : defaultPx2hd;
    // 初始化主题
    const theme = px2hd(deepMix({}, defaultTheme, customTheme)) as Theme;
    const devicePixelRatio = pixelRatio ? pixelRatio : theme.pixelRatio;

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
      supportTouchEvent: true,
      supportsPointerEvents: true,
      createImage,
    });

    // 设置默认的全局样式
    const documentElement = canvas.document.documentElement;
    documentElement.style.fontSize = theme.fontSize;
    documentElement.style.fontFamily = theme.fontFamily;

    const container = canvas.getRoot();

    const { width: canvasWidth, height: canvasHeight } = canvas.getConfig();
    const style = px2hd({
      left: 0,
      top: 0,
      width: canvasWidth,
      height: canvasHeight,
      padding: theme.padding,
      ...customStyle,
    });
    const layout = Layout.fromStyle(style);

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
      style: {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
      },
      layout: {
        width: layout.width,
        height: layout.height,
        left: layout.left,
        top: layout.top,
        right: 0,
        bottom: 0,
      },
      // @ts-ignore
      type: Canvas,
      props,
      shape: container,
      animate,
      // @ts-ignore
      component: this,
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

  emit(type: string, event?: any) {
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

  destroy() {
    const { canvas } = this;
    canvas.destroy();

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

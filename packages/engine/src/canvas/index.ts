import { mix, deepMix, pick } from '@antv/util';
import Component from '../component';
import equal from '../component/equal';
import { Group, Text, Canvas as GCanvas } from '@antv/g';
import { createMobileCanvasElement } from '@antv/g-mobile-canvas-element';
import { createUpdater } from '../component/updater';
import { renderChildren, renderComponent } from '../component/diff';
import EE from '@antv/event-emitter';
import Timeline from './timeline';
import defaultTheme from './theme';
import { px2hd as defaultPx2hd, checkCSSRule } from './util';
import Gesture from '../gesture';

interface CanvasProps {
  context?: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  pixelRatio?: number;
  padding?: number | string | (number | string)[];
  animate?: boolean;
  children?: any;
  px2hd?: any;
  theme?: any;
  style?: any;
  container?: any;
  renderer?: any;
  createImage?: (src?: string) => HTMLImageElement;
  landscape?: boolean;
}

function measureText(container: Group, px2hd) {
  return (text: string, font?) => {
    // todo:canvas为异步，想要立刻拿到宽高只能把默认值补全
    const {
      fontSize = 12,
      fontFamily = '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
      fontWeight = 'normal',
      fontVariant = 'normal',
      fontStyle = 'normal',
      textAlign = 'start',
      textBaseline = 'bottom',
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
    };

    const result = checkCSSRule('text', style);
    // @ts-ignore
    const shape = new Text({ style: result });

    container.appendChild(shape);
    const { width, height } = shape.getBBox();

    shape.remove(true);
    return {
      width,
      height,
    };
  };
}

// 顶层Canvas标签
class Canvas extends Component<CanvasProps> {
  canvas: GCanvas;
  private _ee: EE;
  private timeline: Timeline;
  theme: any;
  gesture: Gesture;
  landscape: boolean;

  constructor(props: CanvasProps) {
    super(props);
    const {
      context,
      renderer,
      width,
      height,
      animate = true,
      px2hd = defaultPx2hd,
      pixelRatio = 1,
      theme: customTheme = {},
      createImage,
      landscape,
      container: rendererContainer,
    } = props;

    // 组件更新器
    const updater = createUpdater(this);

    const theme = px2hd(deepMix({}, defaultTheme, customTheme));

    const canvasElement = createMobileCanvasElement(context);

    const canvas = new GCanvas({
      container: rendererContainer,
      canvas: canvasElement,
      devicePixelRatio: pixelRatio,
      renderer,
      width,
      height,
      supportTouchEvent: true,
      supportsPointerEvents: true,
      createImage,
    });
    const container = canvas.getRoot();
    // 设置全局样式
    const defalutStyle = mix(defaultTheme, pick(customTheme, Object.keys(defaultTheme)));

    mix(container.style, defalutStyle);
    this.gesture = new Gesture(canvas);

    // 供全局使用的一些变量
    const componentContext = {
      root: this,
      canvas,
      px2hd,
      theme,
      gesture: this.gesture,
      measureText: measureText(container, px2hd),
    };

    this._ee = new EE();
    this.context = componentContext;
    this.updater = updater;
    this.theme = theme;
    this.animate = animate;
    this.canvas = canvas;
    this.container = container;
    this.timeline = new Timeline();
    // todo: 横屏事件逻辑
    this.landscape = landscape;
  }

  renderComponents(components: Component[]) {
    if (!components || !components.length) {
      return;
    }
    const { timeline } = this;
    timeline.reset();
    renderComponent(components);
    timeline.onEnd(() => {
      this._animationEnd();
    });
  }

  async update(nextProps: CanvasProps) {
    const { props } = this;
    if (equal(nextProps, props)) {
      return;
    }

    this.props = nextProps;
    await this.render();
  }
  //@ts-ignore
  async render() {
    const { children: lastChildren, props, timeline, canvas } = this;
    const { children: nextChildren } = props;

    await canvas.ready;
    timeline.reset();
    //@ts-ignore
    renderChildren(this, nextChildren, lastChildren);
    timeline.onEnd(() => {
      this._animationEnd();
    });

    return null;
  }

  _animationEnd() {
    this.emit('animationEnd');
  }

  destroy() {}

  emit(type: string, event?: any) {
    this._ee.emit(type, event);
  }
  on(type: string, listener) {
    this._ee.on(type, listener);
  }

  off(type: string, listener?) {
    this._ee.off(type, listener);
  }

  setContext(obj: object) {
    this.context = {
      ...this.context,
      ...obj,
    };
  }

  getCanvasConfig() {
    return this.canvas.getConfig();
  }
}

export default Canvas;

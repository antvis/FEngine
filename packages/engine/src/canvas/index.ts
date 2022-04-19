// import { deepMix } from '@antv/util';
import Component from '../component';
// import Layout from '../component/layout';
import equal from '../component/equal';
import { Text } from '@antv/g';
import { px2hd as defaultPx2hd } from './util';
import { createUpdater } from '../component/updater';
import { renderChildren, renderComponent } from '../component/diff';
import EE from '@antv/event-emitter';
import { Canvas as GCanvas } from '@antv/g-mobile';
import { render } from './render';
import AnimateController from './animation/animateController';

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
}

function measureText(canvas, px2hd, theme) {
  // TODO
  return (text: string, font?) => {
    const { fontSize: defaultFontsize, fontFamily: defaultFamily } = font || {};

    font = {
      ...font,
      fontSize: px2hd(defaultFontsize) || theme.fontSize,
      fontFamily: defaultFamily || theme.fontFamily,
    };

    const result = JSON.parse(JSON.stringify(font));

    const shape = new Text({
      style: {
        ...result,
        x: 0,
        y: 0,
        text,
      },
    });
    canvas.appendChild(shape);
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
  private animateControllers: AnimateController[];
  private theme: any;
  container: GCanvas;

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
    } = props;

    // 组件更新器
    const updater = createUpdater(this);

    const theme = px2hd(customTheme);

    const canvas = new GCanvas({
      context,
      devicePixelRatio: pixelRatio,
      renderer,
      width,
      height,
    });

    // 供全局使用的一些变量
    const componentContext = {
      root: this,
      px2hd,
      theme,
      measureText: measureText(canvas, px2hd, theme),
    };

    this.canvas = canvas;
    this._ee = new EE();
    this.context = componentContext;
    this.updater = updater;
    this.theme = theme;
    this.animate = animate;
    this.container = canvas;
    // 单帧动画
    this.animateControllers = [];
  }

  renderComponents(components: Component[]) {
    if (!components || !components.length) {
      return;
    }
    renderComponent(components);
    this._render();
  }

  update(nextProps: CanvasProps) {
    const { props } = this;
    if (equal(nextProps, props)) {
      return;
    }

    this.props = nextProps;
    this.render();
  }

  render() {
    const { children: lastChildren, props } = this;
    const { children: nextChildren } = props;

    renderChildren(this, nextChildren, lastChildren);
    this._render();
    return null;
  }

  _render() {
    const { children, canvas, animateControllers } = this;
    const animateController = new AnimateController();

    render(children, {
      // @ts-ignore
      animateController,
    });

    // 获取当帧动画时长
    const endTime = animateController.getMaxEndTime();

    animateController.animationEnd(() => this._animationEnd());
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
    return this.canvas.getConfig().canvas;
  }
}

export default Canvas;

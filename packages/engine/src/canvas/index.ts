// import { deepMix } from '@antv/util';
import Component from '../component';
// import Layout from '../component/layout';
import equal from '../component/equal';
import { Group, Text } from '@antv/g';
import { createUpdater } from '../component/updater';
import { renderChildren, renderComponent } from '../component/diff';
import EE from '@antv/event-emitter';
import { Canvas as GCanvas } from '@antv/g-mobile';
import Timeline from './timeline';
import { px2hd as defaultPx2hd } from './util';

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

function measureText(container: Group, px2hd, theme) {
  return (text: string, font?) => {
    const { fontSize, fontFamily, fontStyle, fontWeight, fontVariant } = font || {};
    // TODO: 属性为undefine时报错
    const result = JSON.parse(
      JSON.stringify({
        style: {
          x: 0,
          y: 0,
          fontSize: px2hd(fontSize) || theme.fontSize,
          fontFamily: fontFamily || theme.fontFamily,
          fontStyle,
          fontWeight,
          fontVariant,
          text,
        },
      })
    );
    const shape = new Text(result);
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
    const container = canvas.getRoot();

    // 供全局使用的一些变量
    const componentContext = {
      root: this,
      canvas,
      px2hd,
      theme,
      measureText: measureText(container, px2hd, theme),
    };

    this._ee = new EE();
    this.context = componentContext;
    this.updater = updater;
    this.theme = theme;
    this.animate = animate;
    this.canvas = canvas;
    this.container = container;
    this.timeline = new Timeline();
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

  update(nextProps: CanvasProps) {
    const { props } = this;
    if (equal(nextProps, props)) {
      return;
    }

    this.props = nextProps;
    this.render();
  }

  render() {
    const { children: lastChildren, props, timeline } = this;
    const { children: nextChildren } = props;

    timeline.reset();

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
    return this.canvas.getConfig().canvas;
  }
}

export default Canvas;

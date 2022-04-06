// import { deepMix } from '@antv/util';
import Component from '../component';
// import Layout from '../component/layout';
import equal from '../component/equal';
// import Animation from './animation';
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
  padding?: number | string | (number | string)[];
  animate?: boolean;
  children?: any;
  px2hd?: any;
  theme?: any;
  style?: any;
  container?: any;
  renderer?: any;
}

// function measureText(canvas, px2hd) {
//   return (text: string, font?) => {
//     const { fontSize, fontFamily, fontStyle, fontWeight, fontVariant } = font || {};
//     const shape = canvas.addShape('text', {
//       attrs: {
//         x: 0,
//         y: 0,
//         fontSize: px2hd(fontSize),
//         fontFamily,
//         fontStyle,
//         fontWeight,
//         fontVariant,
//         text,
//       },
//     });
//     const { width, height } = shape.getBBox();
//     shape.remove(true);
//     return {
//       width,
//       height,
//     };
//   };
// }

// 顶层Canvas标签
class Canvas extends Component<CanvasProps> {
  private canvas: GCanvas;
  private _ee: EE;
  private animateControllers: AnimateController[];

  constructor(props: CanvasProps) {
    super(props);
    const { context, renderer, width, height, animate = true, px2hd } = props;

    // 组件更新器
    const updater = createUpdater(this);

    // 供全局使用的一些变量
    const componentContext = {
      root: this,
      px2hd,
      // measureText: measureText(canvas, px2hd),
    };

    this.canvas = new GCanvas({
      context,
      devicePixelRatio: 1,
      renderer,
    });

    this._ee = new EE();
    this.context = componentContext;
    this.updater = updater;
    this.animate = animate;
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
      container: canvas,
      animateController,
    });

    // 获取当帧动画时长
    const endTime = animateController.getMaxEndTime();

    animateController.animationEnd(this._animationEnd);
  }

  _animationEnd() {
    // console.log('当帧动画结束');
  }

  destroy() {}

  on(type: string, listener) {
    this._ee.on(type, listener);
  }

  emit(type: string, event?: any) {
    this._ee.emit(type, event);
  }

  off(type: string, listener?) {
    this._ee.off(type, listener);
  }
}

export default Canvas;

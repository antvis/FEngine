import { JSX } from '../jsx/jsx-namespace';
import { Group } from '@antv/g-lite';
import { ComponentContext } from '../canvas';
import { Updater } from './updater';
import { VNode } from '../canvas/vnode';
import Animator from '../canvas/render/animator';

export interface IProps {
  zIndex?: number;
  [key: string]: any;
}

class Component<P extends IProps = any, S = any> {
  props: P;
  state: S;
  context: ComponentContext;
  refs: {
    [key: string]: Component;
  };
  updater: Updater<S>;
  // 对应 G 的group, 每个组件渲染的父节点
  container: Group;
  style: any;
  // render 返回的节点
  children: VNode | VNode[] | null;

  animate: boolean;
  animator: Animator;

  // State 内部私有属性
  destroyed = false;
  _vNode: VNode;

  constructor(props: P, context?: ComponentContext, updater?: Updater<S>) {
    this.props = props;
    this.state = {} as S;
    this.context = context;
    this.updater = updater;
  }
  willMount() {}
  didMount() {}
  shouldUpdate(_nextProps: P): boolean {
    return true;
  }
  willReceiveProps(_props: P, _context?: ComponentContext) {}
  willUpdate() {}
  didUpdate() {}
  render(): JSX.Element | null {
    return null;
  }
  willUnmount() {}
  didUnmount() {}
  setState(partialState: S, callback?: () => void) {
    if (this.destroyed) {
      return;
    }
    this.updater.enqueueSetState(this, partialState, callback);
  }
  forceUpdate(callback?: () => void) {
    if (this.destroyed) {
      return;
    }
    this.updater.enqueueForceUpdate(this, {} as S, callback);
  }
  setAnimate(animate: boolean) {
    this.animate = animate;
  }
  destroy() {
    this.destroyed = true;
    this._vNode = null;
    this.animator = null;
  }
}

// 标识是否是组件
// @ts-ignore
Component.prototype.isF2Component = true;

export default Component;

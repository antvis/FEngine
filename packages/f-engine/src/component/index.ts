import { JSX } from '../jsx/jsx-namespace';
import { IProps, IState } from '../types/jsx';
import { Group } from '@antv/g-lite';
import { IContext, LayoutProps } from '../types';
import { Updater } from './updater';
import { VNode } from '../canvas/vnode';
import Animator from '../canvas/render/animator';

export interface Props extends IProps {
  zIndex?: number;
}

class Component<P extends Props = IProps, S = IState> {
  props: P;
  state: S;
  context: IContext;
  refs: {
    [key: string]: Component;
  };
  updater: Updater<S>;
  // 对应 G 的group, 每个组件渲染的父节点
  container: Group;
  layout: LayoutProps;
  // render 返回的节点
  children: VNode | VNode[] | null;
  isMounted = false;

  animate: boolean;
  animator: Animator;

  // State 内部私有属性
  destroyed = false;
  _vNode: VNode;

  constructor(props: P, context?: IContext, updater?: Updater<S>) {
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
  willReceiveProps(_props: P, _context?: IContext) {}
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
    this._vNode.animate = animate;
  }
  destroy() {
    this.destroyed = true;
    this.animator = null;
  }
}

// 标识是否是组件
// @ts-ignore
Component.prototype.isF2Component = true;

export default Component;

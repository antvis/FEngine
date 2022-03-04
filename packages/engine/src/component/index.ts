export interface ComponentContext {
  // px2hd: typeof px2hd;
  [key: string]: any;
}

export interface Updater<S = any> {
  enqueueSetState: (component: Component, partialState: S, callback?: () => void) => void;
  enqueueForceUpdate: (component: Component, partialState: S, callback?: () => void) => void;
}

class Component<P = any, S = any> {
  props: P;
  state: S;
  context: ComponentContext;
  refs: {
    [key: string]: Component;
  };
  updater: Updater<S>;

  // render 返回的节点
  children: JSX.Element;
  animate: boolean;
  constructor(props: P, context?: ComponentContext, updater?: Updater<S>) {
    this.props = props;
    this.state = {} as S;
    this.context = context;
    this.updater = updater;
  }
  willMount() {}
  didMount() {}
  willReceiveProps(_props: P) {}
  willUpdate() {}
  didUpdate() {}
  render(): JSX.Element | null {
    return null;
  }
  willUnmount() {}
  didUnmount() {}
  setState(partialState: S, callback?: () => void) {
    this.updater.enqueueSetState(this, partialState, callback);
  }
  forceUpdate(callback?: () => void) {
    this.updater.enqueueForceUpdate(this, {} as S, callback);
  }
  setAnimate(animate: boolean) {
    this.animate = animate;
  }
}

// 标识是否是组件
// @ts-ignore
Component.prototype.isF2Component = true;

export default Component;

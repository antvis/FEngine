import Component from './index';
import Children from '../children';

function getTransformComponent(component: Component) {
  if (!component) return null;
  // @ts-ignore
  const { __lastElement, children } = component;
  if (__lastElement) {
    return component;
  }
  if (!children) {
    return null;
  }

  let componentFromChildren = null;
  Children.map(children, (item) => {
    if (componentFromChildren) return;
    if (!item) return;
    const component = getTransformComponent(item.component);
    if (component) {
      componentFromChildren = component;
    }
  });
  return componentFromChildren;
}

function getTransformFromComponentRef(transformFromRef) {
  if (!transformFromRef || !transformFromRef.current) {
    return null;
  }
  const transformFromComponent = transformFromRef.current;
  return getTransformComponent(transformFromComponent);
}

function createComponent(parent: Component, element: JSX.Element): Component {
  const { type, props } = element;
  const {
    context,
    updater,
    //@ts-ignore
    transformFrom,
  } = parent;
  const { transformFrom: transformFromRef, ...receiveProps } = props;
  let component: Component;
  // @ts-ignore
  if (type.prototype && type.prototype.isF2Component) {
    // @ts-ignore
    component = new type(receiveProps, context, updater);
  } else {
    component = new Component(receiveProps, context, updater);
    component.render = function() {
      // @ts-ignore
      return type(this.props, context, updater);
    };
  }
  // 因为view 可能在子组件，所以这里要透传到子组件
  if (transformFrom) {
    // @ts-ignore
    component.transformFrom = transformFrom;
  }
  if (transformFromRef) {
    const transformFromComponent = transformFromRef
      ? getTransformFromComponentRef(transformFromRef)
      : null;
    // @ts-ignore
    component.transformFrom = transformFromComponent;
  }
  component.context = context;
  component.updater = updater;
  return component;
}

export { createComponent };

import { JSX } from '../jsx/jsx-namespace';
import { isArray, isUndefined, isBoolean, pick } from '@antv/util';
import Component from './index';
import equal from './equal';
import Children from '../children';
import { renderShapeGroup, deleteElement } from '../canvas/render';
import { Group } from '@antv/g';

interface Element extends JSX.Element {
  component: Component;
}

function pickElement(element) {
  if (!element) return element;
  return Children.map(element, (item) => {
    if (!item) return item;
    // 只需要这几个元素就可以了
    return pick(item, ['key', 'ref', 'type', 'props']);
  });
}

function setComponentAnimate(child: Component, parent: Component) {
  const { animate: parentAnimate } = parent;
  // 如果父组件不需要动画，子组件全不不执行动画
  if (parentAnimate === false) {
    child.animate = false;
    return;
  }
  const { props: childProps } = child;
  const { animate: childAnimate } = childProps;
  child.animate = isBoolean(childAnimate) ? childAnimate : parentAnimate;
}

function getTransformComponent(component: Component) {
  if (!component) return null;
  // @ts-ignore
  const { children, childrenIsShape } = component;
  if (childrenIsShape) {
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
  const { type, props, ref } = element;
  const {
    container,
    context,
    updater,
    // @ts-ignore
    timeline,
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

  // 设置ref
  if (ref) {
    ref.current = component;
  }

  if (transformFromRef) {
    const transformFromComponent = transformFromRef
      ? getTransformFromComponentRef(transformFromRef)
      : null;
    // @ts-ignore
    component.transformFrom = transformFromComponent;
  } else if (transformFrom) {
    // 因为view 可能在子组件，所以这里要透传到子组件
    // @ts-ignore
    component.transformFrom = transformFrom;
  }

  component.context = context;
  component.updater = updater;
  // @ts-ignore
  component.timeline = timeline;
  const group = new Group();
  container.appendChild(group);
  component.container = group;
  return component;
}

function updateComponent(component: Component, nextElement: JSX.Element, parent: Component) {
  const { props, ref } = nextElement;
  const { transformFrom: transformFromRef } = props;

  // 更新 ref 引用
  if (ref) {
    ref.current = component;
  }

  // @ts-ignore
  const { transformFrom } = parent;

  if (transformFromRef) {
    const transformFromComponent = transformFromRef
      ? getTransformFromComponentRef(transformFromRef)
      : null;
    // @ts-ignore
    component.transformFrom = transformFromComponent;
  } else if (transformFrom) {
    // 因为view 可能在子组件，所以这里要透传到子组件
    // @ts-ignore
    component.transformFrom = transformFrom;
  }
}

function renderComponent(component: Component | Component[]) {
  Children.map(component, (item: Component) => {
    const { children: lastChildren } = item;
    const mount = isUndefined(lastChildren);
    if (mount) {
      item.willMount();
    } else {
      item.willUpdate();
    }
  });

  Children.map(component, (item: Component) => {
    // @ts-ignore
    const { children: lastChildren } = item;
    const mount = isUndefined(lastChildren);
    const newChildren = item.render();

    renderChildren(item, newChildren, lastChildren);
    if (mount) {
      item.didMount();
    } else {
      item.didUpdate();
    }
  });
}

function destroyElement(parent: Component, elements: JSX.Element) {
  if (!parent) return;
  Children.map(elements, (element) => {
    if (!element) return;
    const { component } = element;
    if (!component) {
      setTimeout(() => {
        deleteElement(element, parent);
      });
      return;
    }
    component.willUnmount();
    destroyElement(component, component.children);
    component.didUnmount();
    component.destroy();
  });
}

function diffElement(nextElement: JSX.Element, lastElement: JSX.Element, parent: Component) {
  if (!nextElement && !lastElement) {
    return null;
  }

  // 删除
  if (!nextElement && lastElement) {
    destroyElement(parent, lastElement);
    return null;
  }

  // 新建
  if (nextElement && !lastElement) {
    return nextElement;
  }

  // diff
  const { type: nextType, props: nextProps } = nextElement;
  const { type: lastType, props: lastProps, component: lastComponent } = lastElement;

  // 这里一定是function
  if (nextType !== lastType) {
    if (
      // @ts-ignore
      nextType.prototype?.isF2Component ||
      // @ts-ignore
      lastType.prototype?.isF2Component
    ) {
      destroyElement(parent, lastElement);
    } else {
      const { type } = nextElement;
      const { context, updater } = parent;
      // 替换成新的 render 函数
      lastComponent.render = function() {
        // @ts-ignore
        return type(this.props, context, updater);
      };
      // 保留component， 等下一阶段处理
      updateComponent(lastComponent, nextElement, parent);
      nextElement.component = lastComponent;
    }

    return nextElement;
  }

  // 保留component， 等下一阶段处理
  updateComponent(lastComponent, nextElement, parent);
  nextElement.component = lastComponent;
  if (equal(nextProps, lastProps)) {
    return null;
  }
  return nextElement;
}
function diff(parent: Component, nextChildren, lastChildren) {
  // destroy
  // 生命周期的几个阶段
  // should create / update
  // create / Receive props
  // willMount / willUpdate
  // render
  // didMount / didUpdate

  let childrenArray = [];
  // 1. 第一轮比较， 直接destroy的元素处理掉，destroy 的元素不需要进入下一阶段
  Children.compare(nextChildren, lastChildren, (next, last) => {
    const element = diffElement(next, last, parent);

    if (element) {
      childrenArray = childrenArray.concat(Children.toArray(element).filter(Boolean));
    }
  });
  // 2. 处理 shouldCreate 和 shouldUpdate
  const shouldProcessChildren = childrenArray.filter((element: JSX.Element) => {
    const { component, props } = element;
    // 说明是新增的元素，需要新建
    if (!component) return true;
    // 不需要更新
    if (component.shouldUpdate(props) === false) {
      return false;
    }
    return true;
  });
  // 3. 处理 create 和 Receive props
  const shouldRenderComponent = shouldProcessChildren.map((element: JSX.Element) => {
    let { component } = element;
    if (!component) {
      component = createComponent(parent, element);
    } else {
      const { props } = element;
      component.willReceiveProps(props);
      component.props = props;
    }

    element.component = component;
    setComponentAnimate(component, parent);
    return component;
  });

  // 4. 处理 render
  renderComponent(shouldRenderComponent);

  // 按子组件顺序渲染内容
  childrenArray.forEach((element: JSX.Element) => {
    const { component } = element;
    const { container: parentGroup } = parent;
    parentGroup.appendChild(component.container);
  });

  return nextChildren;
}

function isContainer(children: Element | Element[]) {
  if (!children) return false;
  if (!isArray(children)) {
    const { type } = children;
    return typeof type === 'function';
  }

  for (let i = 0, len = children.length; i < len; i++) {
    if (isContainer(children[i])) {
      return true;
    }
  }
  return false;
}

function renderChildren(parent: Component, nextChildren, lastChildren) {
  // react 生成的 element 是 not extensible 的，这里新建一个新对象，并把需要的内容pick 出来
  nextChildren = pickElement(nextChildren);

  if (!isContainer(nextChildren)) {
    parent.children = renderShapeGroup(parent, nextChildren);
    // @ts-ignore
    parent.childrenIsShape = true;
  } else {
    // @ts-ignore
    parent.childrenIsShape = false;
    parent.children = nextChildren;
    diff(parent, nextChildren, lastChildren);
  }
  // 设置 children 的引用
  // parent.children = nextChildren;
  return parent.children;
}

export { renderChildren, renderComponent };

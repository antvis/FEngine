import { isArray, isUndefined, isBoolean, pick, last, isString } from '@antv/util';
import { DisplayObject, Group } from '@antv/g';
import PublicComponent from './index';
import equal from './equal';
import Children from '../children';
import { createComponent } from './component';
import { renderComponentShape } from './shape';

// 内部私有的对象
interface Component extends PublicComponent {
  transformFrom: any;
  shape: DisplayObject;
}

interface Element extends JSX.Element {
  component: Component;
}

function pickElement(element: Element) {
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

function createElement(parent: Component, element: Element) {
  const { type, ref } = element;

  let instance;
  // 字符串是标签，函数是组件
  if (isString(type)) {
    // instance = createShape(parent, element);
    element.shape = true;
  } else {
    instance = createComponent(parent, element);
    instance.container = new Group();
    element.component = instance;
  }

  // 设置ref
  if (ref) {
    ref.current = instance;
  }
}

function deleteElement(parenet: Component, element: Element) {
  // const {}
}

function diffElement(parent: Component, nextElement: Element, lastElement: Element) {
  // const { type: nextType, props: nextProps } = nextElement;
  // const { type: lastType, props: lastProps } = lastElement;
  // if (nextType !== lastType) {
  //   deleteElement(parent, lastElement);
  //   createElement(parent, nextElement);
  // }
  // // 保留component， 等下一阶段处理
  // nextElement.component = lastComponent;
  // if (equal(nextProps, lastProps)) {
  //   return null;
  // }
  // return nextElement;
}

function renderChildren(parent: Component, nextChildren, lastChildren) {
  // react 生成的 element 是 not extensible 的，这里新建一个新对象，并把需要的内容pick 出来
  nextChildren = pickElement(nextChildren);

  const childrenArray = [];
  Children.compare(nextChildren, lastChildren, (nextElement, lastElement) => {
    if (!nextElement && !lastElement) {
      return null;
    }

    // 新建
    if (nextElement && !lastElement) {
      createElement(parent, nextElement);
      childrenArray.push(nextElement);
      return;
    }

    // 删除
    if (!nextElement && lastElement) {
      deleteElement(parent, lastElement);
      return null;
    }

    // diff
    const { type: nextType, props: nextProps } = nextElement;
    const { type: lastType, props: lastProps, component: lastComponent } = lastElement;

    if (nextType !== lastType) {
      deleteElement(parent, lastElement);
      return nextElement;
    }

    if (!isString(nextType)) {
      // 保留component， 等下一阶段处理
      nextElement.component = lastComponent;
      if (!equal(nextProps, lastProps)) {
        childrenArray.push(nextElement);
      }
      return nextElement;
    }
  });

  // 2. 处理 shouldCreate 和 shouldUpdate
  const shouldProcessChildren = childrenArray.filter((element: JSX.Element) => {
    const { shape, component, children, props } = element;
    // 说明是 shape
    if (shape) {
      renderComponentShape(parent, element, children);
      return false;
    }
    if (!component) return false;
    parent.container.appendChild(component.container);
    if (component.mounted && component.shouldUpdate(props) === false) {
      return false;
    }
    return true;
  });

  // 3. 处理 create 和 Receive props
  const shouldRenderComponent = shouldProcessChildren.map((element: JSX.Element) => {
    const { component } = element;
    if (component.mounted) {
      const { props } = element;
      component.willReceiveProps(props);
      component.props = props;
    }
    setComponentAnimate(component, parent);
    return component;
  });

  // 4. 处理 render
  renderComponent(shouldRenderComponent);

  parent.children = nextChildren;

  return nextChildren;

  // 设置 children 的引用
  // parent.children = nextChildren;

  // if (!isContainer(nextChildren)) {
  //   // TODO
  //   // @ts-ignore
  //   parent.isShapeComponent = true;
  //   return;
  // }

  // return diff(parent, nextChildren, lastChildren);
}

export { renderChildren };

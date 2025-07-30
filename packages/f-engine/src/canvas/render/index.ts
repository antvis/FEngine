import { JSX } from '../../jsx/jsx-namespace';
import { ElementType } from '../../types/jsx';
import { isBoolean, isNumber, pick } from '@antv/util';
import Component from '../../component';
import Children from '../../children';
import { VNode } from '../vnode';
import { createShape, updateShape } from './createShape';
import { Group } from '@antv/g-lite';
import equal from '../equal';
import { createAnimation, calAnimationTime } from './animation';
import Animator from './animator';
import { getWorkTag, ClassComponent, Shape, WorkTag } from '../workTags';
import {
  computeLayout,
  createNodeTree,
  computeCSSLayout,
  fillElementLayout,
  fillComponentLayout,
} from './computeLayout';
import findClosestShapeNode from './findClosestShapeNode';

function pickElement(element: JSX.Element | JSX.Element[] | null) {
  if (!element) return element;
  return Children.map(element, (item) => {
    if (!item) return item;
    // 只需要这几个元素就可以了
    return pick(item, ['key', 'ref', 'type', 'props']);
  });
}

function getStyle(tagType: WorkTag, props, context) {
  const { style: customStyle = {}, attrs, zIndex } = props;

  if (tagType === Shape) {
    return context.px2hd({
      ...customStyle,
      ...attrs,
    });
  }

  if (isNumber(zIndex)) {
    return { zIndex };
  }

  return {};
}

// vnode 上的 context 做父子节点的 context 传递
function readVNodeContext(vNodeType: ElementType, parentContext) {
  // @ts-ignore
  const contextInjecter = vNodeType.contextInjecter;
  if (!contextInjecter) {
    return parentContext;
  }
  // copy parentContext
  return { ...parentContext };
}

// component 上的 context 是实际使用的 context
function readComponentContext(vNodeType: ElementType, vNodeContext) {
  // @ts-ignore
  const contextType = vNodeType.contextType;
  if (!contextType) {
    return vNodeContext;
  }
  const { _currentValue } = contextType;

  if (!_currentValue) {
    return vNodeContext;
  }

  return _currentValue;
}

function createVNode(parent: VNode, vNode: VNode) {
  const { canvas, context: parentContext, updater, animate: parentAnimate } = parent;

  const { ref, type, props: originProps } = vNode;
  const { animate, transformFrom, ...props } = originProps;

  const tag = getWorkTag(type);
  const context = readVNodeContext(type, parentContext);
  const animator = new Animator();
  const style = getStyle(tag, props, context);

  animator.vNode = vNode;

  vNode.parent = parent;
  vNode.tag = tag;
  vNode.style = style;
  vNode.context = context;
  vNode.updater = updater;
  vNode.canvas = canvas;
  vNode.animate = isBoolean(animate) ? animate : parentAnimate;
  vNode.animator = animator;

  // shape 标签
  if (tag === Shape) {
    const shape = createShape(type as string, { ...props, style });
    if (ref) {
      ref.current = shape;
    }

    // @ts-ignore
    shape._vNode = vNode; // shape 保留 vNode 的引用
    vNode.shape = shape;
  } else {
    const componentContext = readComponentContext(type, context);
    // 组件
    let component: Component;
    if (tag === ClassComponent) {
      // @ts-ignore
      component = new type(props, componentContext, updater);
    } else {
      component = new Component(props, componentContext, updater);
      component.render = function() {
        // @ts-ignore update的时候用最新的context
        return type(this.props, this.context, updater);
      };
    }
    const group = new Group();

    component.container = group;

    // 设置ref
    if (ref) {
      ref.current = component;
    }

    component.context = componentContext;
    component.updater = updater;
    component.animator = animator;
    component._vNode = vNode;
    vNode.shape = group;
    vNode.component = component;
  }

  if (transformFrom && transformFrom.current) {
    const transformVNode = transformFrom.current._vNode;
    vNode.transform = findClosestShapeNode(transformVNode);
    if (vNode.transform) {
      vNode.transform.parent.children = null;
    }
  }

  return vNode;
}

function updateVNode(parent, nextNode: VNode, lastNode: VNode) {
  const { canvas, context, updater, animate: parentAnimate } = parent;
  const { tag, animator, component, shape, children, props: lastProps } = lastNode;
  const { type, props } = nextNode;
  const { animate } = props;

  animator.vNode = nextNode;
  nextNode.parent = parent;
  nextNode.tag = tag;
  nextNode.canvas = canvas;
  nextNode.context = readVNodeContext(type, context);
  nextNode.updater = updater;
  nextNode.component = component;
  nextNode.shape = updateShape(shape, props, lastProps);
  nextNode.parent = parent;
  nextNode.children = children;
  nextNode.animate = isBoolean(animate) ? animate : parentAnimate;
  nextNode.animator = animator;
  nextNode.style = getStyle(tag, props, context);

  // 更新 component
  if (component) {
    component._vNode = nextNode;
  } else {
    // 说明是 shape 标签
    // @ts-ignore
    shape._vNode = nextNode;
  }

  return nextNode;
}

function createElement(parent: VNode, element: JSX.Element): VNode | VNode[] | null {
  return Children.map(element, (el: VNode | null) => {
    if (!el) return el;
    return createVNode(parent, el);
  });
}

function destroyElement(vNode: VNode | VNode[] | null) {
  Children.map(vNode, (node: VNode | null) => {
    if (!node) return;
    const { component, children } = node;
    if (component) {
      component.willUnmount();
      destroyElement(children);
      component.didUnmount();
      component.destroy();
    } else {
      destroyElement(children);
    }
  });
}

function updateElement(parent: VNode, nextElement: JSX.Element, lastElement: VNode) {
  const { type: nextType, props: nextProps } = nextElement;
  const { type: lastType, props: lastProps } = lastElement;

  if (nextType === lastType) {
    const nextVNode = updateVNode(parent, nextElement as VNode, lastElement);
    // props 无变化 和 context 都无变化
    if (equal(nextProps, lastProps) && parent.context === lastElement.context) {
      return null;
    }
    return nextVNode;
  }

  const nextVNode = createVNode(parent, nextElement as VNode);
  destroyElement(lastElement);
  return nextVNode;
}

function diffElement(
  parent: VNode,
  nextElement: JSX.Element,
  lastElement: JSX.Element,
): VNode | VNode[] | null {
  if (!nextElement && !lastElement) {
    return null;
  }

  // 删除
  if (!nextElement && lastElement) {
    destroyElement(lastElement as VNode);
    return null;
  }

  // 新建
  if (nextElement && !lastElement) {
    return createElement(parent, nextElement);
  }

  // 更新
  return updateElement(parent, nextElement, lastElement as VNode);
}

function renderComponentNodes(componentNodes: VNode[] | null) {
  if (!componentNodes || !componentNodes.length) {
    return;
  }

  // 1. shouldUpdate & willReceiveProps
  const shouldProcessChildren = componentNodes.filter((node: VNode) => {
    const { type, component, props, context, layout } = node;

    // 更新组件 layout
    component.layout = layout;

    // 新创建的 component
    if (!component.isMounted) return true;
    // 不需要更新
    if (component.shouldUpdate(props) === false) {
      return false;
    }
    const componentContext = readComponentContext(type, context);
    component.willReceiveProps(props, componentContext);
    component.props = props;
    component.context = context;
    return true;
  });

  if (!shouldProcessChildren.length) {
    return;
  }

  // 2. willMount / willUpdate
  shouldProcessChildren.forEach((child: VNode) => {
    const { component } = child;
    if (!component.isMounted) {
      component.willMount();
    } else {
      component.willUpdate();
    }
  });

  // 3. render
  shouldProcessChildren.forEach((child: VNode) => {
    const { canvas, component, children } = child;

    const newChildren = canvas.toRawChildren(component.render());
    renderChildren(child, newChildren as VNode, children);

    if (!component.isMounted) {
      component.didMount();
      component.isMounted = true;
    } else {
      component.didUpdate();
    }
  });
}

function renderVNode(
  vNode: VNode,
  nextChildren: VNode | VNode[] | null,
  lastChildren: VNode | VNode[] | null,
) {
  const { component } = vNode;

  // 不修改原始对象，这里重新 pick 一次，
  const newChildren = pickElement(nextChildren);

  // 设置新的 children
  vNode.children = newChildren;
  // 如果是组件，需要同时更新组件的 children
  // 等同于 vNode.tag === ClassComponent || vNode.tag === FunctionComponent
  if (component) {
    component.children = newChildren;
  }

  let componentNodeChildren: VNode[] = [];

  Children.compare(newChildren, lastChildren, (next: JSX.Element, last: JSX.Element) => {
    const element = diffElement(vNode, next, last);

    Children.map(element, (child: VNode) => {
      if (!child) return;
      const { tag, props: childProps, children: childLastChildren } = child;

      let childrenNode = [];
      if (tag === Shape) {
        childrenNode = renderVNode(child, childProps.children, childLastChildren);
      } else {
        childrenNode = [child];
      }
      componentNodeChildren = componentNodeChildren.concat(childrenNode);
    });
  });

  return componentNodeChildren;
}

function renderChildren(
  parent: VNode,
  nextChildren: VNode | VNode[] | null,
  lastChildren: VNode | VNode[] | null,
) {
  // 返回的都是 classComponent 的节点
  const componentNodeChildren = renderVNode(parent, nextChildren, lastChildren);

  // 计算 flex 布局
  const nodeTree = createNodeTree(parent);
  computeCSSLayout(nodeTree);
  fillElementLayout(nodeTree);
  fillComponentLayout(parent);

  const { children: newChildren } = parent;
  if (!componentNodeChildren.length) {
    return newChildren;
  }

  renderComponentNodes(componentNodeChildren);

  return newChildren;
}

function render(vNode: VNode) {
  const { children: lastChildren, props } = vNode;
  const { children: nextChildren } = props;

  // render 节点
  const children = renderChildren(vNode, nextChildren, lastChildren);

  // 创建动画
  const childrenAnimation = createAnimation(vNode, children, lastChildren);

  // 执行动画
  if (childrenAnimation.length) {
    childrenAnimation.forEach((animator) => {
      animator.run();
    });
  }
}

// setState 触发的更新
function updateComponents(components: Component[]) {
  if (!components.length) return;

  components.forEach((component) => {
    const { _vNode: vNode, children: lastChildren, props, animator } = component;

    // 是否需要更新
    if (component.shouldUpdate(props) === false) {
      return false;
    }
    component.willUpdate();
    const { canvas } = vNode;
    const newChildren = canvas.toRawChildren(component.render());
    const nextChildren = renderChildren(vNode, newChildren as VNode, lastChildren);

    // 更新 children
    component.children = nextChildren;
    vNode.children = nextChildren;

    // 创建动画
    const childrenAnimation = createAnimation(vNode, nextChildren, lastChildren);

    if (childrenAnimation.length) {
      animator.children = childrenAnimation;
    }

    // 执行动画
    animator.run();

    component.didUpdate();
  });
}

function getUpdateAnimation(component, newChildren, keyFrame) {
  const { preNode } = component;
  const { children: lastChildren, props } = preNode;

  // 是否需要更新
  if (component.shouldUpdate(props) === false) {
    return false;
  }
  component.willUpdate();

  const nextChildren = renderChildren(preNode, newChildren as VNode, lastChildren);

  // 更新 children
  component.preNode.children = nextChildren;

  // 创建动画
  const childrenAnimation = createAnimation(preNode, nextChildren, lastChildren);
  component.didUpdate();

  // 处理 animator
  const animUnits = calAnimationTime(childrenAnimation, keyFrame);

  return animUnits;
}

export {
  render,
  renderChildren,
  updateComponents,
  computeLayout,
  destroyElement,
  getUpdateAnimation,
};

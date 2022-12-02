import { JSX } from '../../jsx/jsx-namespace';
import { isBoolean, isNumber } from '@antv/util';
import Component from '../../component';
import Children from '../../children';
import { VNode } from '../vnode';
import { createShape } from './createShape';
import { Group } from '@antv/g-lite';
import equal from '../equal';
import { createAnimation } from './animation';
import Animator from './animator';
import { getWorkTag, ClassComponent, Shape, WorkTag } from '../workTags';
import {
  computeLayout,
  createNodeTree,
  computeCSSLayout,
  fillElementLayout,
  fillComponentLayout,
} from './computeLayout';

function getStyle(tagType: WorkTag, props, context) {
  const { style: customStyle = {}, attrs, zIndex } = props;

  if (tagType === Shape) {
    return context.px2hd({
      ...customStyle,
      ...attrs,
    });
  }

  // const style = {
  //   position: 'absolute',
  //   left: 0,
  //   top: 0,
  //   right: 0,
  //   bottom: 0,
  // } as Record<string, any>;

  if (isNumber(zIndex)) {
    return { zIndex };
  }

  return {};
}

function createVNode(parent: VNode, vNode: VNode) {
  const { canvas, context, updater, animate: parentAnimate } = parent;
  const { ref, type, props } = vNode;
  const { animate, transformFrom } = props;

  const tag = getWorkTag(type);
  const animator = new Animator();
  const style = getStyle(tag, props, context);

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
    // 组件
    let component: Component;
    if (tag === ClassComponent) {
      // @ts-ignore
      component = new type(props, context, updater);
    } else {
      component = new Component(props, context, updater);
      component.render = function() {
        // @ts-ignore
        return type(this.props, context, updater);
      };
    }
    const group = new Group();
    component.container = group;

    // 设置ref
    if (ref) {
      ref.current = component;
    }

    component.context = context;
    component.updater = updater;
    component.animator = animator;
    component._vNode = vNode;
    vNode.shape = group;
    vNode.component = component;
  }

  if (transformFrom && transformFrom.current) {
    const transformVNode = transformFrom.current._vNode;
    vNode.children = transformVNode.children;
    transformVNode.children = null;
  }

  return vNode;
}

function updateVNode(parent, nextNode, lastNode: VNode) {
  const { canvas, context, updater, animate: parentAnimate } = parent;
  const { tag, animator, component, shape, children } = lastNode;
  const { props } = nextNode;
  const { animate } = props;

  nextNode.tag = tag;
  nextNode.canvas = canvas;
  nextNode.context = context;
  nextNode.updater = updater;
  nextNode.component = component;
  nextNode.shape = shape;
  nextNode.parent = parent;
  nextNode.children = children;
  nextNode.animate = isBoolean(animate) ? animate : parentAnimate;
  nextNode.animator = animator;
  nextNode.style = getStyle(tag, props, context);

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
    }
  });
}

function updateElement(parent: VNode, nextElement: JSX.Element, lastElement: VNode) {
  const { type: nextType, props: nextProps } = nextElement;
  const { type: lastType, props: lastProps } = lastElement;

  if (nextType === lastType) {
    const nextVNode = updateVNode(parent, nextElement, lastElement);
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
  lastElement: JSX.Element
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
    const { component, props, context, layout } = node;

    // 更新组件 layout
    component.layout = layout;

    // 新创建的 component
    if (!component.children) return true;
    // 不需要更新
    if (component.shouldUpdate(props) === false) {
      return false;
    }
    component.willReceiveProps(props, context);
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
    if (!component.children) {
      component.willMount();
    } else {
      component.willUpdate();
    }
  });

  // 3. render
  shouldProcessChildren.forEach((child: VNode) => {
    const { canvas, component, children } = child;
    const mount = !component.children;

    const newChildren = canvas.toRawChildren(component.render());
    renderChildren(child, newChildren as VNode, children);

    if (mount) {
      component.didMount();
    } else {
      component.didUpdate();
    }
  });
}

function renderVNode(
  node: VNode,
  nextChildren: VNode | VNode[] | null,
  lastChildren: VNode | VNode[] | null
) {
  const { component } = node;

  // 设置新的 children
  node.children = nextChildren;
  // 如果是组件，需要同时更新组件的 children
  // 等同于 node.tag === ClassComponent || node.tag === FunctionComponent
  if (component) {
    component.children = nextChildren;
  }

  let componentNodeChildren: VNode[] = [];

  Children.compare(
    // @ts-ignore
    nextChildren,
    // @ts-ignore
    lastChildren,
    (next: JSX.Element, last: JSX.Element) => {
      const element = diffElement(node, next, last);

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
    }
  );

  return componentNodeChildren;
}

function renderChildren(
  parent: VNode,
  nextChildren: VNode | VNode[] | null,
  lastChildren: VNode | VNode[] | null
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
  // vNode.children = children;
  // 创建动画
  const childrenAnimation = createAnimation(vNode, children, lastChildren);

  // 执行动画
  if (childrenAnimation.length) {
    childrenAnimation.forEach((animator) => {
      animator.play();
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
    component.didUpdate();

    // 创建动画
    const childrenAnimation = createAnimation(vNode, nextChildren, lastChildren);

    if (childrenAnimation.length) {
      animator.children = childrenAnimation;
    }

    // 执行动画
    animator.play();
  });
}

export { render, renderChildren, updateComponents, computeLayout };

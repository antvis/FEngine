import { JSX } from '../../jsx/jsx-namespace';
import Component from '../../component';
import Children from '../../children';
import { isNumber, isArray } from '@antv/util';
import getShapeAttrs from '../shape';
import { VNode } from '../vnode';
import { Shape, FunctionComponent, ClassComponent, getWorkTag } from '../workTags';
import computeCSSLayout from './css-layout';

export interface INode {
  className?: string;
  children?: INode[];
  layout: any;
}

function createMeasure(style, measureText) {
  return function(/* width */) {
    const { text, width, height } = style;

    let outputWidth = width;
    let outputHeight = height;
    if (!isNumber(width) || !isNumber(height)) {
      const { width: measureWidth, height: measureHeight } = measureText(text, style);
      if (!isNumber(width)) {
        outputWidth = measureWidth;
      }
      if (!isNumber(height)) {
        outputHeight = measureHeight;
      }
    }

    return {
      width: outputWidth,
      height: outputHeight,
    };
  };
}

function getChildrenLayout(nodeTree: NodeTree[]) {
  if (!nodeTree) return;

  let left = 0;
  let top = 0;
  let right = 0;
  let bottom = 0;
  let width = 0;
  let height = 0;
  nodeTree.forEach((node) => {
    const { layout } = node;
    if (!layout) return;
    left = Math.min(left, layout.left);
    top = Math.min(top, layout.top);
    right = Math.min(right, layout.left + layout.width);
    bottom = Math.min(bottom, layout.top + layout.height);
    width = Math.max(width, layout.width);
    height = Math.max(height, layout.height);
  });
  return {
    left,
    top,
    right,
    bottom,
    width,
    height,
  };
}

class NodeTree {
  className?: string;
  children?: NodeTree[];
  layout: any;

  constructor(node: INode) {
    const { className, children, layout } = node;
    const nodeChildren =
      children && children.length ? children.map((child) => new NodeTree(child)) : undefined;

    const nodeLayout = layout ? layout : getChildrenLayout(nodeChildren);

    this.children = nodeChildren;
    this.layout = nodeLayout;
    this.className = className;
  }

  getElementsByClassName(targetClassName: string) {
    const result: INode[] = [];
    const { className, children } = this;
    if (className === targetClassName) {
      result.push(this);
    }
    if (children) {
      children.forEach((child) => {
        result.push(...child.getElementsByClassName(targetClassName));
      });
    }
    return result;
  }
}

// 展开数组
function extendMap(arr, fn: Function) {
  if (!arr) {
    return arr;
  }
  if (!isArray(arr)) {
    return [fn(arr)];
  }
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (isArray(element)) {
      newArray = newArray.concat(extendMap(element, fn));
    } else if (element) {
      newArray.push(fn(element));
    }
  }
  return newArray;
}

// 主要是把function节点，全部转换成string标签节点
function renderJSXElement(element: JSX.Element, context, updater) {
  if (!element) return element;
  const { px2hd, measureText } = context;
  const { type, props } = element;

  const tag = getWorkTag(type);

  // 只处理 function 组件
  if (tag === FunctionComponent) {
    // @ts-ignore
    const newElement = type(element.props, context, updater);
    // return element if type is string
    return renderJSXElement(newElement, context, updater);
  }

  const { className, style: customStyle = {}, attrs, children: newChildren } = props;

  const style = px2hd({
    ...customStyle,
    ...attrs,
  });

  // 文本需要计算文本的宽高来进行flex布局
  if (type === 'text') {
    style.measure = createMeasure(style, measureText);
  }

  // render children first
  const nextChildren = newChildren
    ? Children.toArray(newChildren).map((child: JSX.Element) => {
        return renderJSXElement(child, context, updater);
      })
    : [];

  return {
    type,
    className,
    children: nextChildren.filter(Boolean),
    style,
  };
}

// 计算布局
function computeLayout(component: Component, newChildren: JSX.Element) {
  const { context, updater } = component;
  const nodeTree = renderJSXElement(newChildren, context, updater);

  computeCSSLayout(nodeTree);

  // 构造一个 NodeTree, 方便外部使用
  return new NodeTree(nodeTree);
}

// 创建布局的计算树
function createNodeTree(vNode: VNode) {
  const { tag, type, style, context, children: vNodeChildren } = vNode;
  const { measureText } = context;
  const children = extendMap(vNodeChildren, (child: VNode) => {
    return createNodeTree(child);
  });

  // 文本需要计算文本的宽高来进行flex布局
  if (type === 'text') {
    style.measure = createMeasure(style, measureText);
  }

  return {
    tag,
    type,
    style,
    children,
    // 保留对 vNode 的引用，用于把布局结果回填
    vNode,
  };
}

function computeComponentLayout(node) {
  const { children, vNode } = node;
  // 组件当前的 layout
  const { layout } = vNode;
  node.layout = layout;
  if (!children || !children.length) {
    return;
  }
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    const { tag } = child;

    if (tag === Shape || tag === FunctionComponent) {
      computeCSSLayout(child);
    } else {
      // ClassComponent
      const { width, height } = layout;
      child.layout = {
        width,
        height,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      };
    }
  }
  return node;
}

function fillElementLayout(node) {
  const { type, style, vNode, children, layout } = node;
  const attrs = getShapeAttrs(type, layout);

  if (style.measure) {
    delete style.measure;
  }

  // 更新布局和样式
  vNode.layout = layout;
  vNode.style = {
    ...attrs,
    ...style,
  };
  if (!children || !children.length) {
    return;
  }
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    const { tag } = child;
    // 如果是 ClassComponent， 让 layout 占满父节点
    if (tag === ClassComponent && layout) {
      const { width, height } = layout;
      child.layout = {
        width,
        height,
        left: 0,
        top: 0,
      };
    }

    fillElementLayout(child);
  }
}

export { computeLayout, createNodeTree, computeComponentLayout, fillElementLayout };

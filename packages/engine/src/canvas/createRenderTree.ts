import { isArray } from '@antv/util';
import Children from '../children';
import { px2hd } from './util';
import { ELEMENT_DELETE } from '../component/elementStatus';
import computeLayout from './css-layout';

// 展开数组
function flatChildren(arr, fn: Function) {
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
      newArray = newArray.concat(flatChildren(element, fn));
    } else if (element) {
      newArray.push(fn(element));
    }
  }
  return newArray;
}

// 转换成布局所需要的布局树
function createNodeTree(element) {
  const { key, ref, _cache, type, props, status, animation } = element;
  const children = flatChildren(props.children, (child) => {
    return createNodeTree(child);
  });

  // const { style, attrs } = props;
  const style = px2hd(props.style);
  const attrs = px2hd(props.attrs);

  // 文本要自动计算文本的宽高, TODO, 后面再优化
  // if (type === 'text') {
  //   const shape = container.addShape(type, {
  //     attrs: {
  //       x: 0,
  //       y: 0,
  //       ...attrs,
  //     },
  //   });
  //   const { width, height } = shape.getBBox();
  //   style = {
  //     width,
  //     height,
  //     ...style,
  //   };
  //   // 无用，销毁掉
  //   shape.remove(true);
  // }

  return {
    key,
    ref,
    _cache,
    type,
    props,
    children,
    status,
    animation,

    // 处理px2hd之后的配置
    style,
    attrs,
  };
}

// 过滤删除的元素，让其不参与布局计算
function filterDeleteElement(node) {
  const { status, children } = node;
  if (status === ELEMENT_DELETE) {
    return null;
  }
  if (!children || !children.length) {
    return node;
  }

  const newChildren = children.filter((child) => {
    return !!filterDeleteElement(child);
  });

  // 要保留引用
  node.children = newChildren;
  node.renderChildren = children;

  return node;
}

// 渲染树
function createRenderTree(children) {
  const newChildren = Children.map(children, (element) => {
    const { component } = element;
    if (!component) {
      return null;
    }
    const { renderElement, children } = component;
    if (!renderElement) {
      return createRenderTree(children);
    }

    const nodeTree = createNodeTree(renderElement);
    const computeLayoutTree = filterDeleteElement(nodeTree);
    computeLayout(computeLayoutTree);
    return computeLayoutTree;
  });
  return flatChildren(newChildren, (child) => child);
}

export default createRenderTree;

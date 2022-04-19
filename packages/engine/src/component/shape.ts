import { isBoolean } from '@antv/util';
import Component from './index';
import renderJSXElement from './renderJSXElement';
import { extendMap } from '../canvas/util';
import computeLayout from './css-layout';
import { renderShape } from './shapeRender';

// 转换成布局所需要的布局树
function createNodeTree(element) {
  const { props } = element;
  const children = extendMap(props.children, (child) => {
    return createNodeTree(child);
  });
  const { style } = props;

  // const style = {
  //   ...px2hd(props.style),
  //   ...px2hd(props.attrs),
  // };

  return {
    style,
    children,
    // 保留对 element 的引用，用于把布局结果回填
    element,
  };
}

function fillElementLayout(node) {
  const { layout, element, children } = node;
  element.layout = layout;
  if (children && children.length) {
    for (let i = 0, len = children.length; i < len; i++) {
      fillElementLayout(children[i]);
    }
  }
}

function renderComponentShape(
  parent: Component,
  nextElement: JSX.Element,
  lastElement: JSX.Element
) {
  const { context, updater } = parent;
  // const lastElement = __lastElement || (transformFrom && transformFrom.__lastElement);
  // children 是 shape 的 jsx 结构, component.render() 返回的结构
  const shapeElement = renderJSXElement(nextElement, context, updater);

  // 布局计算
  const nodeTree = createNodeTree(shapeElement);
  computeLayout(nodeTree);
  fillElementLayout(nodeTree);

  renderShape(parent, shapeElement, null);

  // TODO: diff 比较

  //

  // // @ts-ignore
  // component.__lastElement = shapeElement;

  // renderShape(shapeElement, lastElement, options);
}

export { renderComponentShape, renderShape };

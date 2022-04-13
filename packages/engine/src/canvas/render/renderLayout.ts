import { extendMap, px2hd } from '../util';
import Children from '../../children';
import getShapeAttrs from '../shape';

// 转换成布局所需要的布局树
function createNodeTree(element) {
  const { key, ref, _cache, type, props, status, animation } = element;
  const children = extendMap(props.children, (child) => {
    return createNodeTree(child);
  });

  const style = {
    ...px2hd(props.style),
    ...px2hd(props.attrs),
  };

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
    // attrs,
  };
}

function mergeLayout(parent, layout) {
  if (!parent || !layout) return layout;
  const { left: parentLeft, top: parentTop } = parent;
  const { left, top } = layout;
  return {
    ...layout,
    left: parentLeft + left,
    top: parentTop + top,
  };
}

function getLayoutChild(children, layoutStack, parentLayout) {
  return Children.map(children, (child) => {
    const { type } = child;

    const item = layoutStack.splice(0, 1)[0];
    console.log(parentLayout);
    const layout = mergeLayout(parentLayout, item.layout);

    const elementAttrs = {
      ...getShapeAttrs(type, layout),
      ...item.attrs,
      ...item.style,
    };

    child = {
      ...child,
      style: elementAttrs,
      // layout: layout.layout,
      // lastLayout: layout.lastLayout,
    };

    return child;
  });
}

function updateNodeTree(jsxTree, layoutTree) {
  const { children } = jsxTree.props;
  // const elementAttrs = {
  //   ...layoutTree.style,
  //   ...jsxTree.attrs,
  //   ...jsxTree.style,
  // };
  jsxTree.style = layoutTree.style;
  const { children: layoutStack } = layoutTree;
  // debugger;
  if (children) {
    jsxTree.props.children = getLayoutChild(children, layoutStack, null);
  }
}

export { createNodeTree, mergeLayout, updateNodeTree };

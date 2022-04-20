import { extendMap } from '../util';
import getShapeAttrs from '../shape';

function createNodeTree(element, px2hd) {
  const { type, props } = element;
  const children = extendMap(props.children, (child) => {
    return createNodeTree(child, px2hd);
  });
  const { style, attrs } = props;

  return {
    type,
    style: {
      ...px2hd(style),
      ...px2hd(attrs),
    },
    children,
    // 保留对 element 的引用，用于把布局结果回填
    element,
  };
}

function fillElementLayout(node) {
  const { type, style, element, children, layout } = node;
  const attrs = getShapeAttrs(type, layout);

  element.layout = layout;
  element.style = {
    ...style,
    ...attrs,
  };
  if (children && children.length) {
    for (let i = 0, len = children.length; i < len; i++) {
      fillElementLayout(children[i]);
    }
  }
}

export { createNodeTree, fillElementLayout };

import { extendMap } from '../util';
import getShapeAttrs from '../shape';

function createNodeTree(element, context) {
  const { type, props } = element;
  const { px2hd, measureText, root } = context;
  // const {container} = root
  const children = extendMap(props.children, (child) => {
    return createNodeTree(child, context);
  });
  const { style, attrs } = props;
  let mergeStyle = {
    ...px2hd(style),
    ...px2hd(attrs),
  };
  // 文本需要计算文本的宽高来进行flex布局
  if (type === 'text') {
    const {
      fontSize,
      fontFamily,
      fontWeight,
      fontVariant,
      fontStyle,
      textAlign,
      textBaseline,
    } = mergeStyle;
    const { width, height } = measureText(style?.text || attrs?.text, {
      fontSize,
      fontFamily,
      fontWeight,
      fontVariant,
      fontStyle,
      textAlign,
      textBaseline,
    });
    mergeStyle = {
      width,
      height,
      ...mergeStyle,
    };
  }

  return {
    type,
    style: mergeStyle,
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

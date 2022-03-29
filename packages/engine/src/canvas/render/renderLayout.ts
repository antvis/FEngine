import { extendMap, px2hd } from '../util';

// 转换成布局所需要的布局树
function createNodeTree(element, container) {
  const { key, ref, _cache, type, props, status, animation } = element;
  const children = extendMap(props.children, (child) => {
    return createNodeTree(child, container);
  });
  // Children.map(props.children, (child) => {
  //     return createNodeTree(child, container);
  //   });
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

export { createNodeTree, mergeLayout };

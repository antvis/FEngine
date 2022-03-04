import Children from '../children';

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

function createRenderTree(element, container) {
  const { key, ref, _cache, type, props, status, animation } = element;
  const children = extendMap(props.children, (child) => {
    return createRenderTree(child, container);
  });

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

function render(children: JSX.Element | JSX.Element[] | null, container) {
  const renderTree = createRenderTree(children);
}

export default render;

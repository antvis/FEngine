import { JSX } from './jsx/jsx-namespace';
import { isArray, isNil } from '@antv/util';

function cloneElement(element, props) {
  if (!element) return element;
  return {
    ...element,
    props: {
      ...element.props,
      ...props,
    },
  };
}

function map(children: any, fn: any) {
  if (!children) {
    return fn(children);
  }
  if (isArray(children)) {
    return children.map((child) => {
      return map(child, fn);
    });
  }
  return fn(children);
}

function compareArray(
  nextElements: JSX.Element[],
  lastElements: JSX.Element[],
  callback: Function
) {
  const keyed = {};
  const nextLength = nextElements.length;
  const lastLength = lastElements.length;
  for (let i = 0, len = lastLength; i < len; i++) {
    const element = lastElements[i];
    if (element && !isNil(element.key)) {
      const { key } = element;
      keyed[key] = element;
    }
  }

  const result = [];

  // 比较元素
  for (let i = 0, len = nextLength; i < len; i++) {
    const element = nextElements[i];
    if (!element) {
      continue;
    }
    const { key } = element;
    let lastElement;
    // 有key值定义
    if (!isNil(element.key)) {
      lastElement = keyed[key];
      if (lastElement) delete keyed[key];
    } else {
      // 取相同位置的元素
      lastElement = lastElements[i];
    }

    // 没有直接返回
    if (!lastElement) {
      result.push(compare(element, null, callback));
      continue;
    }

    // 如果 lastElement 已经被处理过, next 处理成新增
    if (lastElement.__processed) {
      result.push(compare(element, null, callback));
      continue;
    }
    // 标记 element 已经被处理过
    lastElement.__processed = true;
    result.push(compare(element, lastElement, callback));
  }
  // 处理 lastElements 里面还未被处理的元素
  for (let i = 0, len = lastLength; i < len; i++) {
    const lastElement = lastElements[i];
    if (!lastElement) {
      continue;
    }
    if (!lastElement?.__processed) {
      result.push(compare(null, lastElement, callback));
    } else {
      delete lastElement.__processed;
    }
  }
  return result;
}

// 比较2棵树
function compare(nextElement: JSX.Element, lastElement: JSX.Element, callback: Function) {
  // 有一个为空
  if (!nextElement || !lastElement) {
    return callback(nextElement, lastElement);
  }

  if (isArray(nextElement) || isArray(lastElement)) {
    const nextElementArray = isArray(nextElement) ? nextElement : [nextElement];
    const lastElementArray = isArray(lastElement) ? lastElement : [lastElement];
    return compareArray(nextElementArray, lastElementArray, callback);
  }

  return callback(nextElement, lastElement);
}

function toArray(element: JSX.Element): JSX.Element[] | null {
  if (!element) {
    return element as null;
  }
  if (!isArray(element)) {
    return [element];
  }
  let newArray = [];
  for (let i = 0, len = element.length; i < len; i++) {
    const item = element[i];
    if (isArray(item)) {
      // @ts-ignore
      newArray = newArray.concat(toArray(item));
    } else {
      newArray.push(item);
    }
  }
  return newArray;
}

const Children = {
  cloneElement,
  map,
  toArray,
  compare,
};

export default Children;

import { JSX as JSXNamespace } from './jsx-namespace';
import { ElementType } from '../types';

export namespace jsx {
  // https://www.tslang.cn/docs/handbook/jsx.html
  export namespace JSX {
    export type Element = JSXNamespace.Element;
    export type ElementClass = JSXNamespace.ElementClass;
    export type IntrinsicElements = JSXNamespace.IntrinsicElements;
    export type ElementAttributesProperty = JSXNamespace.ElementAttributesProperty;
    export type ElementChildrenAttribute = JSXNamespace.ElementChildrenAttribute;
    export type IntrinsicAttributes = JSXNamespace.IntrinsicAttributes;
    export type IntrinsicClassAttributes = JSXNamespace.IntrinsicClassAttributes;
  }
}

// 实现jsx-classic 入口
export function jsx(type: ElementType, config, ...children): JSXNamespace.Element {
  const { key, ref, ...props } = config || {};

  // 保持和automatic模式一致
  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }
  return {
    key,
    ref,
    type,
    props,
  };
}

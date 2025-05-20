import { JSX as JSXNamespace } from './jsx-namespace';
import { ElementType } from '../types';

// 实现jsx-automatic 入口
export function jsx(type: ElementType, config, key?: string): JSXNamespace.Element {
  const { ref, ...props } = config || {};

  // Resolve default props
  // This is a simplified version of the React's defaultProps resolution.
  // See https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js
  if (typeof type === 'function' && type['defaultProps']) {
    const defaultProps = type['defaultProps'];
    for (const propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return {
    key,
    ref,
    type,
    props,
  };
}

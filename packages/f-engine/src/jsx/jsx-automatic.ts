import { JSX as JSXNamespace } from './jsx-namespace';
import { ElementType } from '../types';

// 实现jsx-automatic 入口
export function jsx(type: ElementType, config, key?: string): JSXNamespace.Element {
  const { ref, ...props } = config || {};
  return {
    key,
    ref,
    type,
    props,
  };
}

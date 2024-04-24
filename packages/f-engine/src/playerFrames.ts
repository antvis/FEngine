import { isUndefined } from '@antv/util';
import Children from './children';

export interface playerFrame {
  to: Record<string, any>;
  duration?: number;
  delay?: number;
}

export function generateFrameElement(cur: Record<string, playerFrame>, element) {
  if (!element) return;
  return Children.map(element, (child) => {
    const { key, props } = child;

    let newProps = {};
    if (cur[key]) {
      const { to, ...effect } = cur[key]
      newProps = { ...to, effect }
    }

    const children = generateFrameElement(cur, props.children);
    return Children.cloneElement(child, {
      ...newProps, children
    })
  });
}

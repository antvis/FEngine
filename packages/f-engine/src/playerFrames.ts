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

    const newProps = cur[key] ? cur[key].to : {};

    const children = generateFrameElement(cur, props.children);
    return Children.cloneElement(child, { ...newProps, children });
  });
}

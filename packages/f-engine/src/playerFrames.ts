import Children from '../src/children';

export interface playerFrame {
  key: string;
  to: any;
  from?: any;
}

export function handerFrames(cur: Record<string, playerFrame>, element) {
  if (!element) return;
  return Children.map(element, (child) => {
    if (cur[child?.key] as playerFrame) {
      const transStyle = {};

      transStyle[cur[child?.key].key] = cur[child?.key].to;

      return {
        ...child,
        props: {
          ...child.props,
          ...transStyle,
        },
      };
    }
    return {
      ...child,
      props: {
        ...child?.props,
        children: handerFrames(cur, child?.props?.children),
      },
    };
  });
}

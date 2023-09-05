import Children from '../src/children';

export interface playerFrame {
  key: string;
  to: any;
  from?: any;
}

export function handerFrames(cur: Record<string, playerFrame>, element) {
  if (!element) return;
  return Children.map(element, (child) => {
    const transStyle = {};
    if (cur[child?.key] as playerFrame) {
      transStyle[cur[child?.key].key] = cur[child?.key].to;
    }
    // TODO
    return {
      ...child,
      props: {
        ...child?.props,
        ...transStyle,
        children: handerFrames(cur, child?.props?.children),
      },
    };
  });
}

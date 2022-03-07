import Children from '../children';

function renderChildren(elements) {
  return Children.map(elements, (element) => {
    if (!element) return;
    const { type, attrs, children: nodeChildren } = element;
    const children = element.renderChildren ? element.renderChildren : nodeChildren;
    return {
      type,
      props: {
        attrs: attrs,
        children: renderChildren(children),
      },
    };
  });
}

class Render {
  root: any;
  constructor() {
    this.root = {
      type: 'canvas',
    };
  }
  render(renderTree) {
    const { root } = this;
    const children = renderChildren(renderTree);
    root.props = {
      children,
    };
    return root;
  }
}

export default Render;

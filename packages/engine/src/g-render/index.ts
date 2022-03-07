import { Canvas, Group, Circle, Rect, Path, Image, Line, Polyline } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
// import { Renderer as WebGLRenderer } from '@antv/g-webgl';
// import { Renderer as SVGRenderer } from '@antv/g-svg';
import Children from '../children';

// create a renderer
const canvasRenderer = new CanvasRenderer();
// const webglRenderer = new WebGLRenderer();
// const svgRenderer = new SVGRenderer();

const classMap = {
  group: Group,
  circle: Circle,
  rect: Rect,
};

function renderChildren(elements, container) {
  Children.map(elements, (element) => {
    if (!element) return;
    const { type, attrs, children: nodeChildren } = element;
    const ShapeClass = classMap[type];
    const shape = new ShapeClass({
      style: attrs,
    });
    container.appendChild(shape);

    // 如果元素被删除了，就不会有renderChildren， 直接拿node.children渲染
    const children = element.renderChildren ? element.renderChildren : nodeChildren;
    if (children && children.length) {
      for (let i = 0, len = children.length; i < len; i++) {
        renderChildren(children[i], shape);
      }
    }
  });
}

class Render {
  canvas: any;
  constructor() {
    this.canvas = new Canvas({
      container: 'container',
      width: 600,
      height: 500,
      renderer: canvasRenderer,
    });
  }
  render(renderTree) {
    renderChildren(renderTree, this.canvas);

    return this.canvas;
  }
}

export default Render;

import {
  Canvas,
  Renderer,
  Group,
  Text,
  Circle,
  Ellipse,
  Rect,
  Path,
  Image,
  Line,
  Polyline,
  Polygon,
} from '@antv/g-mobile';
import EventController from './event';
// import { Renderer as WebGLRenderer } from '@antv/g-webgl';
// import { Renderer as SVGRenderer } from '@antv/g-svg';
import Children from '../children';

// create a renderer
const render = new Renderer();
// const webglRenderer = new WebGLRenderer();
// const svgRenderer = new SVGRenderer();

const classMap = {
  group: Group,
  text: Text,
  circle: Circle,
  path: Path,
  ellipse: Ellipse,
  rect: Rect,
  image: Image,
  line: Line,
  polyline: Polyline,
  polygon: Polygon,
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

    const eventController = new EventController({ shape, callback: { ...element } });

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
  canvas: Canvas;

  constructor(props) {
    const { context, onClick } = props;
    this.canvas = new Canvas({
      context,
      width: 500,
      height: 500,
      devicePixelRatio: 2,
      renderer: render,
    });
  }

  render(renderTree) {
    renderChildren(renderTree, this.canvas);
    return this.canvas;
  }
}

export default Render;

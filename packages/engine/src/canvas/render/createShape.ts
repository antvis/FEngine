import { Group, Text, Circle, Ellipse, Rect, Path, Image, Line, Polyline, Polygon } from '@antv/g';
import { Arc, Marker, Sector, SmoothPolyline } from '../../shape';
import Hammer from '../event/index';
import { checkCSSRule } from '../util';

const classMap = {
  group: Group,
  text: Text,
  circle: Circle,
  path: Path,
  ellipse: Ellipse,
  rect: Rect,
  image: Image,
  line: Line,
  polyline: SmoothPolyline,
  polygon: Polygon,
  arc: Arc,
  marker: Marker,
  sector: Sector,
};

function createShape(type: string, props, style) {
  if (!type) return null;

  const ShapeClass = classMap[type];
  // const { style } = props;

  const result = checkCSSRule(type, style);

  const shape = new ShapeClass({ style: result });
  addEvent(shape, props);

  return shape;
}

function addEvent(shape, props) {
  //  支持的事件列表
  const {
    onClick,
    onDbClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchEndOutside,
    onPanStart,
    onPan,
    onPanEnd,
    onPress,
    onSwipe,
  } = props;

  if (
    !(
      onClick ||
      onDbClick ||
      onTouchStart ||
      onTouchMove ||
      onTouchEnd ||
      onTouchEndOutside ||
      onPanStart ||
      onPan ||
      onPanEnd ||
      onPress ||
      onSwipe
    )
  ) {
    return;
  }

  const hammer = new Hammer(shape);

  onClick && hammer.on('click', onClick);
  onDbClick && hammer.on('dbclick', onDbClick);

  onTouchStart && hammer.on('touchstart', onTouchStart);
  onTouchMove && hammer.on('touchmove', onTouchMove);
  onTouchEnd && hammer.on('touchend', onTouchEnd);
  onTouchEndOutside && hammer.on('touchendoutside', onTouchEndOutside);

  onPanStart && hammer.on('panstart', onPanStart);
  onPan && hammer.on('pan', onPan);
  onPanEnd && hammer.on('panend', onPanEnd);
  onPress && hammer.on('press', onPress);
  onSwipe && hammer.on('swipe', onSwipe);
}
export { createShape, addEvent };

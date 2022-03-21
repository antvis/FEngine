import { Group, Text, Circle, Ellipse, Rect, Path, Image, Line, Polyline, Polygon } from '@antv/g';
import Hammer from 'hammer';

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

function createShape(type: string, props) {
  if (!type) return null;
  const ShapeClass = classMap[type];
  const { style } = props;
  //  支持的事件列表
  const {
    onClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onPanStart,
    onPan,
    onPanEnd,
    onPress,
    onSwipe,
  } = props;
  const shape = new ShapeClass({ style });

  if (onClick) {
    shape.addEventListener('click', onClick);
  }
  if (onTouchStart) {
    shape.addEventListener('touchstart', onTouchStart);
  }
  if (onTouchMove) {
    shape.addEventListener('touchmove', onTouchMove);
  }
  if (onTouchEnd) {
    shape.addEventListener('touchend', onTouchEnd);
  }

  const hammer = new Hammer(shape);
  hammer.on('panstart', onPanStart);
  hammer.on('panmove', onPan);
  hammer.on('panend', onPanEnd);
  hammer.on('press', onPress);
  hammer.on('swipe', onSwipe);

  return shape;
}

export default createShape;

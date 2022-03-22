import { Group, Text, Circle, Ellipse, Rect, Path, Image, Line, Polyline, Polygon } from '@antv/g';
// import Hammer from 'hammer';
import Hammer from '../event/index';

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
  const shape = new ShapeClass({ style });

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

  return shape;
}

export default createShape;

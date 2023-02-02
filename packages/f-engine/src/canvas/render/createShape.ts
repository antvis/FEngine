import {
  Group,
  Text,
  Circle,
  Ellipse,
  Rect,
  Path,
  Image,
  Line,
  Polygon,
  DisplayObject,
  CSS,
  PropertySyntax,
} from '@antv/g-lite';
import { Arc, Marker, Sector, SmoothPolyline } from '../../shape';
import Gesture from '../../gesture';
import { getTag, registerTag } from '../../jsx/tag';

const EVENT_LIST = [
  ['click', 'onClick'],
  ['touchstart', 'onTouchStart'],
  ['touchmove', 'onTouchMove'],
  ['touchend', 'onTouchEnd'],
  ['touchendoutside', 'onTouchEndOutside'],
  // drage 相关
  ['dragenter', 'onDragEnter'],
  ['dragleave', 'onDragLeave'],
  ['dragover', 'onDragOver'],
  ['drop', 'onDrop'],
  ['dragstart', 'onDragStart'],
  ['drag', 'onDrag'],
  ['dragend', 'onDragEnd'],
  // pan
  ['panstart', 'onPanStart'],
  ['pan', 'onPan'],
  ['panend', 'onPanEnd'],
  // press
  ['pressstart', 'onPressStart'],
  ['press', 'onPress'],
  ['pressend', 'onPressEnd'],
  // swipe
  ['swipe', 'onSwipe'],
  // pinch
  ['pinchstart', 'onPinchStart'],
  ['pinch', 'onPinch'],
  ['pinchend', 'onPinchEnd'],
];

// 默认标签
const TagElements = [
  ['group', Group],
  ['text', Text],
  ['circle', Circle],
  ['path', Path],
  ['ellipse', Ellipse],
  ['rect', Rect],
  ['image', Image],
  ['line', Line],
  ['polyline', SmoothPolyline],
  ['polygon', Polygon],
  ['arc', Arc],
  ['marker', Marker],
  ['sector', Sector],
];

TagElements.map(([type, ShapeClass]) => {
  registerTag(type as string, ShapeClass as typeof DisplayObject);
});

// 注册 css 属性，不能注册已有属性，比如 r width等
const SECTOR_CSS_PROPERTY = [
  {
    name: 'r0',
    inherits: false,
    interpolable: true,
    syntax: PropertySyntax.LENGTH_PERCENTAGE,
  },
  {
    name: 'startAngle',
    inherits: false,
    interpolable: true,
    syntax: PropertySyntax.ANGLE,
  },
  {
    name: 'endAngle',
    inherits: false,
    interpolable: true,
    syntax: PropertySyntax.ANGLE,
  },
];
SECTOR_CSS_PROPERTY.forEach((property) => {
  CSS.registerProperty(property);
});

function createShape(type: string, props) {
  if (!type) return null;
  const ShapeClass = getTag(type);
  if (!ShapeClass) return null;
  // const result = checkCSSRule(type, originStyle);
  const shape = new ShapeClass(props);
  addEvent(shape, props);

  return shape;
}

function addEvent(shape, props) {
  const gesture = new Gesture(shape);

  EVENT_LIST.forEach(([eventName, handlerName]) => {
    if (!props[handlerName]) return;
    gesture.on(eventName, props[handlerName]);
  });
}

export { createShape, addEvent };

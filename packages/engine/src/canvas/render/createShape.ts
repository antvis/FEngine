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
} from '@antv/g-lite';
import { Arc, Marker, Sector, SmoothPolyline } from '../../shape';
import Gesture from '../../gesture';
import { checkCSSRule } from '../util';
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

function createShape(type: string, props, originStyle) {
  if (!type) return null;
  const { style, attrs, ...other } = props;
  const { clip } = originStyle;
  const ShapeClass = getTag(type);
  if (!type) return null;

  if (clip) {
    const ClipShapeClass = getTag(clip?.type);
    const clipPath = new ClipShapeClass({
      ...clip,
      style: {
        ...clip?.attrs,
        ...clip?.style,
      },
    });
    originStyle.clipPath = clipPath;
  }

  const result = checkCSSRule(type, originStyle);
  const shape = new ShapeClass({ ...other, style: result });
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

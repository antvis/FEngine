import { Group, Circle, Ellipse, Image, Polygon, Rect, Text } from '@antv/g';
import { mix } from '../utils';
import { Marker } from './marker';
import { ArrowPath, ArrowPolyline, ArrowLine } from './path';

const DISPLAY_MAP = {
  Group: Group,
  Circle: Circle,
  Ellipse: Ellipse,
  Image: Image,
  Line: ArrowLine,
  Path: ArrowPath,
  Polygon: Polygon,
  Polyline: ArrowPolyline,
  Rect: Rect,
  Text: Text,
  Marker,
};

const defaultAttrs = {
  default: {
    lineWidth: 1,
    stroke: '',
  },
  Text: {
    opacity: 1,
    lineWidth: 0,
    lineAppendWidth: 0,
    strokeOpacity: 1,
    fillOpacity: 1,
    textBaseline: 'bottom',
    stroke: '',
  },
};

export function filterEmptyAttributes(attrs) {
  const res = {};
  Object.entries(attrs).map(([key, value]) => {
    if (value !== null && value !== undefined) res[key] = value;
  });
  return res;
}

export function createDisplayObj(type, cfg) {
  const { attrs, ...rest } = cfg || {};

  const style = mix({}, defaultAttrs[type] || defaultAttrs['default'], attrs);

  let AdapterClass = DISPLAY_MAP[type];

  if (!AdapterClass) {
    AdapterClass = Group;
  }

  return new AdapterClass({ style, ...rest });
}

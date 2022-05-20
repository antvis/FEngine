const elementStyle = {
  fillStyle: 'String',
  font: 'String',
  globalAlpha: 'Number',
  lineCap: 'String',
  lineWidth: 'Number',
  lineJoin: 'String',

  miterLimit: 'Number',
  shadowBlur: 'Number',
  shadowColor: 'String',
  shadowOffsetX: 'Number',
  shadowOffsetY: 'Number',

  strokeStyle: 'String',
  textAlign: 'String',
  textBaseline: 'String',
  lineDash: 'Arrary',

  shadow: 'String',
  matrix: 'Arrary',
  stroke: 'String',
  fill: 'String',
  opacity: 'Number',
  fillOpacity: 'Number',
  strokeOpacity: 'Number',
};

// css规则表 TODO：补充
export const DEFAULT_CSS_RULE = {
  group: {
    ...elementStyle,
  },
  text: {
    ...elementStyle,
    x: 'Number',
    y: 'Number',
    text: 'String',
  },
  circle: {
    ...elementStyle,
    x1: 'Number',
    x2: 'Number',
    y1: 'Number',
    y2: 'Number',
  },
  path: {
    ...elementStyle,
  },
  ellipse: {
    ...elementStyle,
  },
  rect: {
    ...elementStyle,
    width: 'Number',
    height: 'Number',
    x: 'Number',
    y: 'Number',
  },
  image: {
    ...elementStyle,
  },
  line: {
    ...elementStyle,
  },
  polyline: {
    ...elementStyle,
  },
  polygon: {
    ...elementStyle,
  },
  arc: {
    ...elementStyle,
    x: 'Number',
    y: 'Number',
    r: 'Number',
    startAngle: 'Number',
    endAngle: 'Number',
    anticlockwise: 'Boolean',
  },
  marker: {
    ...elementStyle,
  },
  sector: {
    ...elementStyle,
  },
};

import { isArray, isNil } from '@antv/util';

const elementStyle = {
  fillStyle: 'String',
  font: 'String',
  globalAlpha: 'Number',
  lineCap: 'String',
  lineWidth: ['Number', 'String'],
  lineJoin: 'String',

  miterLimit: 'Number',
  shadowBlur: 'Number',
  shadowColor: 'String',
  shadowOffsetX: 'Number',
  shadowOffsetY: 'Number',

  strokeStyle: 'String',
  textAlign: 'String',
  textBaseline: 'String',
  lineDash: ['Array', 'Number'],

  shadow: 'String',
  matrix: 'Array',
  stroke: 'String',
  fill: ['String', 'Object'],
  opacity: 'Number',
  fillOpacity: 'Number',
  strokeOpacity: 'Number',
};

// css规则表 TODO：补充 / 多种类型
const DEFAULT_CSS_RULE = {
  group: {
    ...elementStyle,
  },
  text: {
    ...elementStyle,
    x: 'Number',
    y: 'Number',
    text: 'String',
    width: 'Number',
    height: 'Number',

    fontSize: ['Number', 'String'],
    fontFamily: 'String',
    fontStyle: 'String',
    fontWeight: ['Number', 'String'],
    fontVariant: 'String',
  },
  circle: {
    ...elementStyle,
    cx: 'Number',
    cy: 'Number',
    r: 'Number',
  },
  path: {
    ...elementStyle,
  },
  ellipse: {
    ...elementStyle,
    cy: 'Number',
    cx: 'Number',
    ry: 'Number',
    rx: 'Number',
  },
  rect: {
    ...elementStyle,
    width: 'Number',
    height: 'Number',
    x: 'Number',
    y: 'Number',
    radius: ['Array', 'Number'],
  },
  image: {
    ...elementStyle,
    width: 'Number',
    height: 'Number',
    x: 'Number',
    y: 'Number',
    img: 'String',
    src: 'String',
  },
  line: {
    ...elementStyle,
    x1: 'Number',
    x2: 'Number',
    y1: 'Number',
    y2: 'Number',
  },
  polyline: {
    ...elementStyle,
    points: 'Array',
    smooth: 'Boolean',
  },
  polygon: {
    ...elementStyle,
    points: 'Array',
  },
  arc: {
    ...elementStyle,
    x: 'Number',
    y: 'Number',
    r: 'Number',
    startAngle: ['Number', 'String'],
    endAngle: ['Number', 'String'],
    anticlockwise: 'Boolean',
  },
  marker: {
    ...elementStyle,
    x: 'Number',
    y: 'Number',
    radius: 'Number',
    symbol: 'String',
  },
  sector: {
    ...elementStyle,
    x: 'Number',
    y: 'Number',
    startAngle: ['Number', 'String'],
    endAngle: ['Number', 'String'],
    r: 'Number',
    r0: 'Number',
    anticlockwise: 'Boolean',
  },
};

export default function checkCSSRule(type: string, style: Record<string, any>) {
  if (!style) {
    return style;
  }

  const cssStyle = {};
  Object.keys(style).forEach((key) => {
    const value = style[key];
    if (isNil(value)) {
      return;
    }
    const rule = DEFAULT_CSS_RULE[type] && DEFAULT_CSS_RULE[type][key];
    if (!rule) {
      cssStyle[key] = value;
      return;
    }
    const valueType = Object.prototype.toString.call(value);
    if (isArray(rule)) {
      for (let i = 0, len = rule.length; i < len; i++) {
        if (valueType === `[object ${rule[i]}]`) {
          cssStyle[key] = value;
          return;
        }
      }

      // 没有匹配的类型
      return;
    }
    // string
    if (valueType === `[object ${rule}]`) {
      cssStyle[key] = value;
    }
  });

  return cssStyle;
}

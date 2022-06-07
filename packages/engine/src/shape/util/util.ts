import { CSS, DisplayObject, isNumber, PropertySyntax } from '@antv/g';

const arcToPath = (x, y, r, startAngle, endAngle, anticlockwise, sweepFlag = false) => {
  // 没办法画完整的 Math.PI * 2
  const endAngleOriginal = endAngle;

  if (endAngleOriginal - startAngle === Math.PI * 2) {
    endAngle = Math.PI * 2 - 0.001 + startAngle;
  }

  const { start, end } = getStartEnd(x, y, r, startAngle, endAngle, anticlockwise);

  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  const d = [
    ['M', start.x, start.y],
    ['A', r, r, 0, largeArcFlag, sweepFlag ? 1 : 0, end.x, end.y],
  ];

  return d;
};

const getStartEnd = (x, y, r, startAngle, endAngle, anticlockwise) => {
  let start;
  let end;

  if (anticlockwise) {
    start = polarToCartesian(x, y, r, startAngle);
    end = polarToCartesian(x, y, r, endAngle);
  } else {
    start = polarToCartesian(x, y, r, endAngle);
    end = polarToCartesian(x, y, r, startAngle);
  }

  return { start, end };
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadian: number
) => {
  return {
    x: centerX + radius * Math.cos(angleInRadian),
    y: centerY + radius * Math.sin(angleInRadian),
  };
};

const arc = (x, y, r, startAngle, endAngle, anticlockwise, sweepFlag = false) => {
  // 没办法画完整的 Math.PI * 2
  const endAngleOriginal = endAngle;
  if (endAngleOriginal - startAngle === Math.PI * 2) {
    endAngle = endAngle - 0.001;
    startAngle = startAngle + 0.001;
  }

  const { end } = getStartEnd(x, y, r, startAngle, endAngle, anticlockwise);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  return ['A', r, r, 0, largeArcFlag, sweepFlag ? 1 : 0, end.x, end.y];
};

const getRadAngle = (angle: string | number): number => {
  if (isNumber(angle)) {
    return angle;
  }
  if (/^(\d.)+deg$/.test(angle)) {
    return parseFloat(angle) * (Math.PI / 180);
  }
  return parseFloat(angle);
};

const cssRegister = (objects) => {
  objects.forEach((name) =>
    CSS.registerProperty({
      name,
      inherits: false,
      initialValue: '0deg',
      interpolable: true,
      syntax: PropertySyntax.ANGLE,
    })
  );
};

const clearWapperStyle = (shape: DisplayObject) => {
  shape.setAttribute('x', 0);
  shape.setAttribute('y', 0);
};

export {
  arcToPath,
  polarToCartesian,
  arc,
  getRadAngle,
  cssRegister,
  clearWapperStyle,
  getStartEnd,
};

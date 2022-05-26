function arcToPath(x, y, r, startAngle, endAngle, anticlockwise, sweepFlag = false) {
  // 没办法画完整的 Math.PI * 2
  const endAngleOriginal = endAngle;
  if (endAngleOriginal - startAngle === Math.PI * 2) {
    endAngle = Math.PI * 2 - 0.001;
  }

  const { start, end } = getStartEnd(x, y, r, startAngle, endAngle, anticlockwise);

  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  const d = [
    ['M', start.x, start.y],
    ['A', r, r, 0, largeArcFlag, sweepFlag ? 1 : 0, end.x, end.y],
  ];

  return d;
}

function getStartEnd(x, y, r, startAngle, endAngle, anticlockwise) {
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
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  return {
    x: centerX + radius * Math.cos(angleInDegrees),
    y: centerY + radius * Math.sin(angleInDegrees),
  };
}

function arc(x, y, r, startAngle, endAngle, anticlockwise, sweepFlag = false) {
  const { end } = getStartEnd(x, y, r, startAngle, endAngle, anticlockwise);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return ['A', r, r, 0, largeArcFlag, sweepFlag ? 1 : 0, end.x, end.y];
}
export { arcToPath, polarToCartesian, arc };

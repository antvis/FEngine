function arcToPath(x, y, r, startAngle, endAngle, anticlockwise, sweepFlag = false) {
  let start;
  let end;

  if (anticlockwise) {
    start = polarToCartesian(x, y, r, startAngle);
    end = polarToCartesian(x, y, r, endAngle);
  } else {
    start = polarToCartesian(x, y, r, endAngle);
    end = polarToCartesian(x, y, r, startAngle);
  }

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  const d = [
    // ['M', start.x, start.y],
    ['A', r, r, 0, largeArcFlag, sweepFlag ? 1 : 0, end.x, end.y],
  ];

  return d;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  return {
    x: centerX + radius * Math.cos(angleInDegrees),
    y: centerY + radius * Math.sin(angleInDegrees),
  };
}

export { arcToPath, polarToCartesian };

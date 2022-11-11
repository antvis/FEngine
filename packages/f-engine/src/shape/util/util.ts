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

export { polarToCartesian };

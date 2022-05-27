export default (layout) => {
  const { left, top, width } = layout;
  const r = width / 2;
  return {
    cx: left + r,
    cy: top + r,
    r,
  };
};

import { DisplayObject } from '@antv/g-lite';
import { isFunction } from '@antv/util';
import { createShape } from './createShape';

function applyStyle(shape: DisplayObject, style) {
  if (!style) return;
  Object.keys(style).forEach((key) => {
    // 特殊处理 clip
    if (key === 'clip') {
      const { clip } = style;
      const clipConfig = isFunction(clip) ? clip(style) : clip;

      if (clipConfig) {
        const { type, style } = clipConfig;
        const clipShape = createShape(type, { style });
        (shape as DisplayObject).setAttribute('clipPath', clipShape);
      }
    } else {
      (shape as DisplayObject).setAttribute(key, style[key]);
    }
  });
}

export default applyStyle;

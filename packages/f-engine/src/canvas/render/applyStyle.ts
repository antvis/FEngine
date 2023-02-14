import { DisplayObject, isDisplayObject } from '@antv/g-lite';
import { isFunction } from '@antv/util';
import { createShape } from './createShape';

function applyStyle(shape: DisplayObject, style) {
  if (!style) return;
  Object.keys(style).forEach((key) => {
    // 特殊处理 clip 和 offset
    if (key === 'clip' || key === 'offset') {
      const effect = style[key];

      // value 为 ref
      if (isDisplayObject(effect?.current)) {
        (shape as DisplayObject).setAttribute(`${key}Path`, effect.current);
        return;
      }

      const effectConfig = isFunction(effect) ? effect(style) : effect;
      if (effectConfig) {
        const { type, style } = effectConfig;
        const effectShape = createShape(type, { style });
        (shape as DisplayObject).setAttribute(`${key}Path`, effectShape);
      }
    } else {
      (shape as DisplayObject).setAttribute(key, style[key]);
    }
  });
}

export default applyStyle;

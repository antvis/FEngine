import { DisplayObject } from '@antv/g-lite';

type DisplayObjectConstructor = typeof DisplayObject;

const SHAPE_TAG: Record<string, DisplayObjectConstructor> = {};

/**
 * 注册新的标签
 */
const registerTag = (name: string, ShapeConstructor): void => {
  SHAPE_TAG[name] = ShapeConstructor;
};

const getTag = (type: string): DisplayObjectConstructor => {
  return SHAPE_TAG[type];
};

export { registerTag, getTag };

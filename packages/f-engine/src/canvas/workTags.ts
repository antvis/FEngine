import { ElementType } from '../types';
import { isString } from '@antv/util';

export type WorkTag = 0 | 1 | 2;

export const FunctionComponent = 0;
export const ClassComponent = 1;
export const Shape = 2;

export function getWorkTag(type: ElementType): WorkTag {
  if (isString(type)) {
    return Shape;
  }
  if (type.prototype && type.prototype.isF2Component) {
    return ClassComponent;
  }
  return FunctionComponent;
}

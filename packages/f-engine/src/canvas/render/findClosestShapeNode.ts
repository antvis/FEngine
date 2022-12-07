import Children from '../../children';
import { VNode } from '../vnode';
import { Shape } from '../workTags';

// 查找 transform 最近的 shape 元素
function findClosestShapeNode(vNode: VNode) {
  const { tag, children } = vNode;
  if (tag === Shape) {
    return vNode;
  }
  let shapeNode;
  Children.map(children, (child) => {
    if (shapeNode) return;
    shapeNode = findClosestShapeNode(child);
  });
  return shapeNode;
}

export default findClosestShapeNode;

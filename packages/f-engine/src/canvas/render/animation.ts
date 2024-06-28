import Children from '../../children';
import { VNode } from '../vnode';
import { DisplayObject, IChildNode, convertToPath } from '@antv/g-lite';
import { createShape } from './createShape';
import { Shape } from '../workTags';
import findClosestShapeNode from './findClosestShapeNode';
import Animator from './animator';
import applyStyle from './applyStyle';
import { playerFrame } from '../../playerFrames';
import { isEqual, mix } from '@antv/util';

function findAllShapeNode(vNode: VNode | VNode[] | null) {
  const shapeNodes = [];
  Children.map(vNode, (node: VNode) => {
    if (!node) return;
    const { tag, type, children } = node;
    if (tag === Shape && type !== 'group') {
      shapeNodes.push(node);
    }
    if (children) {
      shapeNodes.push(...findAllShapeNode(children));
    }
  });
  return shapeNodes;
}

function morphShape(lastNode: VNode, nextNode: VNode, animator?: Animator) {
  const { props: nextProps, shape: nextShape, style: nextStyle } = nextNode;
  const { shape: lastShape, style: lastStyle, animator: lastAnimation } = lastNode;

  // 形变动画之前先把原 shape 销毁
  lastShape.destroy();

  const { animate, animation } = nextProps;
  const animationEffect = animation ? animation.update : null;

  if (animate === false || !animationEffect) {
    return animator;
  }

  animator = animator || new Animator();
  // shape 形变
  const { start, end, property = [] } = animationEffect;
  const { parsedStyle: nextParsedStyle } = nextShape;
  const { parsedStyle: lastParsedStyle } = lastShape;

  const lastPath = convertToPath(lastShape);
  const nextPath = convertToPath(nextShape);

  const startStyle = {
    ...lastStyle,
    ...start,
    path: lastPath,
  };
  const endStyle = {
    ...nextStyle,
    ...end,
    path: nextPath,
  };

  const pathShape = createShape('path', { style: { ...startStyle, path: '' } });

  // 形变双方都有的属性才能动画
  const animateProperty = property
    .filter((key) => {
      return nextParsedStyle.hasOwnProperty(key) && lastParsedStyle.hasOwnProperty(key);
    })
    .concat('path');

  animator.animate(pathShape, startStyle, endStyle, {
    ...animationEffect,
    property: animateProperty,
  });

  const { timeline } = nextNode?.context;
  timeline && timeline.delete(lastAnimation);

  animator.once('end', () => {
    if (nextShape.destroyed) {
      return;
    }
    applyStyle(nextShape, endStyle);
    pathShape.replaceWith(nextShape);
  });

  return animator;
}

function appearAnimation(vNode: VNode | VNode[] | null) {
  return Children.map(vNode, (node) => {
    if (!node) return;
    const { tag, shape, style, children, animate, props, animator } = node;
    animator.reset(shape);

    // 有叶子节点，先执行叶子节点
    animator.children = children ? createAnimation(node, children, null) : null;

    // 不需要执行动画
    if (animate === false || tag !== Shape) {
      applyStyle(shape, style);
      return animator;
    }

    const { animation } = props;
    const animationEffect = animation ? animation.appear : null;

    if (!animationEffect) {
      // 没有动画直接应用样式
      applyStyle(shape, style);
      return animator;
    }
    const { start = {}, end } = animationEffect;

    const endStyle = {
      ...style,
      ...end,
    };

    animator.animate(shape, start, endStyle, animationEffect);
    return animator;
  });
}

function updateAnimation(nextNode, lastNode) {
  const {
    tag: nextTag,
    type: nextType,
    style: nextStyle,
    children: nextChildren,
    props: nextProps,
    shape: nextShape,
    animator,
    animate,
  } = nextNode;
  const {
    tag: lastTag,
    type: lastType,
    style: lastStyle,
    children: lastChildren,
    shape: lastShape,
  } = lastNode;
  animator.reset(nextShape);
  // 先处理叶子节点
  animator.children = createAnimation(nextNode, nextChildren, lastChildren);

  const { animation } = nextProps;
  const animationEffect = animation ? animation.update : null;

  // 类型相同
  if (nextType === lastType) {
    // 清除之前的样式
    const resetStyle = lastStyle
      ? Object.keys(lastStyle).reduce((prev, cur) => {
          prev[cur] = '';
          return prev;
        }, {})
      : null;

    // 需要更新的样式
    const style = {
      ...resetStyle,
      ...nextStyle,
    };

    // 组件，直接更新
    if (nextTag !== Shape) {
      applyStyle(nextShape, style);
      return animator;
    }

    // 样式无改变，无更新
    if (isEqual(nextStyle, lastStyle)) {
      return animator;
    }

    // 没有动画直接应用样式
    if (animate === false || !animationEffect) {
      applyStyle(nextShape, style);
      return animator;
    }

    const { start, end } = animationEffect;
    const startStyle = {
      ...lastStyle,
      ...start,
    };
    const endStyle = {
      ...style,
      ...end,
    };

    animator.animate(nextShape, startStyle, endStyle, animationEffect);
    return animator;
  }

  // 无法处理形变
  if (nextTag !== Shape || lastTag !== Shape) {
    lastShape.destroy();
    return animator;
  }

  // 从 shape 到 group
  if (nextType === 'group') {
    const shapeNodes = findAllShapeNode(nextNode.children);
    return shapeNodes.map((node) => {
      return morphShape(lastNode, node);
    });
  }

  // 从 group 到 shape
  if (lastType === 'group') {
    const shapeNodes = findAllShapeNode(lastNode.children);
    return shapeNodes.map((node) => {
      return morphShape(node, nextNode);
    });
  }

  // 没有动画直接应用样式
  if (animate === false || !animationEffect) {
    applyStyle(nextShape, nextStyle);
    return animator;
  }

  return morphShape(lastNode, nextNode, animator);
}

function destroyAnimation(node: VNode) {
  return Children.map(node, (vNode) => {
    if (!vNode) return null;
    const { tag, shape, children, animate, style, props, animator, context } = vNode;
    const { timeline } = context;

    if (shape.destroyed) {
      return null;
    }
    // 重置
    animator.reset(shape);

    // 先处理叶子节点
    const childrenAnimation = children
      ? Children.toArray(children)
          .map((child) => {
            return destroyAnimation(child);
          })
          .filter(Boolean)
      : null;

    // 不需要动画直接删除
    if (animate === false) {
      shape.destroy();
      return animator;
    }

    const { animation } = props;
    const animationEffect = animation ? animation.leave : null;

    // 没有叶子节点的动画， 直接删除
    if (!(childrenAnimation && childrenAnimation.length) && !animationEffect) {
      shape.destroy();
      return animator;
    }

    animator.children = childrenAnimation;

    // 图形有动画
    if (animationEffect && tag === Shape) {
      const { start, end = {} } = animationEffect;

      const startStyle = {
        ...style,
        ...start,
      };
      const endStyle = end;

      animator.animate(shape, startStyle, endStyle, animationEffect);
      timeline && timeline.delete(animator.animations);
    }

    // 动画结束后，删除图形（包括子元素动画）
    animator.once('end', () => {
      shape.destroy();
    });

    return animator;
  });
}

function createAnimator(nextNode, lastNode) {
  if (!nextNode && !lastNode) {
    return null;
  }

  // delete 动画
  if (!nextNode && lastNode) {
    return destroyAnimation(lastNode);
  }

  // 如果有 transform 则从 transform 比
  const { transform } = nextNode;
  if (transform) {
    const closestShapeNode = findClosestShapeNode(nextNode);
    nextNode.transform = null;
    closestShapeNode.transform = transform;
  }

  if (nextNode.transform) {
    if (!lastNode) {
      return updateAnimation(nextNode, nextNode.transform);
    }
    return [updateAnimation(nextNode, nextNode.transform), destroyAnimation(lastNode)];
  }

  // appear 动画
  if (nextNode && !lastNode) {
    return appearAnimation(nextNode);
  }

  // update 动画
  return updateAnimation(nextNode, lastNode);
}

function insertShape(parent: DisplayObject, shape: DisplayObject, nextSibling: IChildNode) {
  if (nextSibling) {
    parent.insertBefore(shape, nextSibling);
  } else {
    parent.appendChild(shape);
  }
}

// 处理 children 的动画
function createAnimation(
  parent: VNode,
  nextChildren: VNode | VNode[],
  lastChildren: VNode | VNode[],
) {
  if (!nextChildren && !lastChildren) {
    return [];
  }
  const { shape: parentShape } = parent;

  // 上一个处理的元素
  let prevSibling: IChildNode;
  const childrenAnimator: Animator[] = [];

  Children.compare(nextChildren, lastChildren, (nextNode, lastNode) => {
    // shape 层才执行动画
    const animator = createAnimator(nextNode, lastNode);
    Children.map(animator, (item: Animator) => {
      if (!item) return;
      childrenAnimator.push(item);
      const { shape } = item;
      if (!shape || shape.destroyed) return;

      let nextSibling: IChildNode;

      // 更新文档流
      if (!prevSibling) {
        nextSibling = parentShape.firstChild;
      } else {
        nextSibling = prevSibling.nextSibling;
      }
      if (nextSibling !== shape) {
        insertShape(parentShape, shape, nextSibling);
      }
      prevSibling = shape;
    });
  });

  return childrenAnimator;
}

function calAnimationTime(
  childrenAnimation: Animator[],
  keyFrame: Record<string, playerFrame>,
  parentEffect?: any,
) {
  if (!childrenAnimation) return { animators: null, time: 0 };

  const animators = [];
  let time = 0;

  Children.map(childrenAnimation, (item: Animator) => {
    if (!item) return;
    const animator = item.clone();
    const { vNode, children } = animator;
    const { duration, delay } = keyFrame[vNode?.key] || {};

    const globalEffect = mix(parentEffect || {}, { duration, delay });
    const effect = { ...animator.effect, ...globalEffect };
    animator.effect = effect;

    // computed time
    const { duration: gDuration = 0, delay: gDelay = 0 } = effect;
    const animUnits = calAnimationTime(children, keyFrame, globalEffect);
    time = Math.max(time, gDuration + gDelay, animUnits.time);

    animator.children = animUnits.animators;
    animators.push(animator);
  });

  return { animators, time };
}

export { createAnimation, calAnimationTime };

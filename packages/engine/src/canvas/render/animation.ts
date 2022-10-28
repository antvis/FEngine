import Children from '../../children';
import { VNode } from '../vnode';
import { DisplayObject, IChildNode, convertToPath } from '@antv/g-lite';
import { isString, isFunction } from '@antv/util';
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

function appearAnimation(vNode: VNode | VNode[] | null) {
  return Children.map(vNode, (node) => {
    if (!node) return;
    const { shape, style, children, props, animator } = node;
    const { animation } = props;
    const animationEffect = animation ? animation.appear : null;

    animator.reset();

    // 叶子是否有动画
    const childrenAnimation = children ? createAnimation(node, children, null) : null;

    if (!animationEffect) {
      // 没有动画直接应用样式
      applyStyle(shape, style);
    }

    // 如果当前和子元素都没有动画，直接返回
    if (!animationEffect && !(childrenAnimation && childrenAnimation.length)) {
      return null;
    }

    // 子元素动画
    if (childrenAnimation && childrenAnimation.length) {
      animator.children = childrenAnimation;
    }

    // 图形有动画
    if (animationEffect) {
      const { start = {}, end } = animationEffect;

      const endStyle = {
        ...style,
        ...end,
      };

      animator.animate(shape, start, endStyle, animationEffect);
    }

    return animator;
  });
}

function updateAnimation(nextNode, lastNode) {
  const {
    type: nextType,
    style: nextStyle,
    children: nextChildren,
    props: nextProps,
    shape: nextShape,
    animator,
  } = nextNode;
  const { type: lastType, style: lastStyle, children: lastChildren, shape: lastShape } = lastNode;

  const { animation } = nextProps;

  animator.reset();

  // 子元素动画
  const childrenAnimation = createAnimation(nextNode, nextChildren, lastChildren);

  if (childrenAnimation && childrenAnimation.length) {
    animator.children = childrenAnimation;
  }

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

  const animationEffect = animation ? animation.update : null;
  // 没有动画直接应用样式
  if (!animationEffect) {
    applyStyle(nextShape, style);
    // 如果也没有子元素动画，直接返回
    if (!childrenAnimation || !childrenAnimation.length) {
      return null;
    }
  }
  // 自身动画
  if (isString(nextType) && isString(lastType)) {
    if (animationEffect) {
      // 图形属性动画
      if (nextType === lastType) {
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
      } else {
        // 形变动画
        const { start, end, property = [] } = animationEffect;

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

        const pathShape = createShape('path', { style: startStyle });

        lastShape.replaceWith(pathShape);

        animator.animate(pathShape, startStyle, endStyle, {
          ...animationEffect,
          property: ['path'].concat(property),
        });

        animator.once('end', () => {
          applyStyle(nextShape, endStyle);
          pathShape.replaceWith(nextShape);
        });
      }
    }
  }
  return animator;
}

function destroyAnimation(vNode: VNode) {
  if (!vNode) return null;
  const { shape, children, style, props, animator } = vNode;
  const { animation } = props;
  const animationEffect = animation ? animation.leave : null;

  // 重置
  animator.reset();

  // 叶子是否有动画
  const childrenAnimation = children
    ? // @ts-ignore
      Children.toArray(children)
        .map((child) => {
          return destroyAnimation(child as VNode);
        })
        .filter(Boolean)
    : null;

  // 没有叶子节点的动画， 直接删除
  if (!(childrenAnimation && childrenAnimation.length) && !animationEffect) {
    shape.remove();
    return null;
  }

  if (childrenAnimation && childrenAnimation.length) {
    animator.children = childrenAnimation;
  }

  // 图形有动画
  if (animationEffect) {
    const { start, end = {} } = animationEffect;

    const startStyle = {
      ...style,
      ...start,
    };
    const endStyle = end;

    animator.animate(shape, startStyle, endStyle, animationEffect);
  }

  animator.once('end', () => {
    shape.remove();
  });

  return animator;
}

function createAnimator(nextNode, lastNode) {
  if (!nextNode && !lastNode) {
    return;
  }

  // delete 动画
  if (!nextNode && lastNode) {
    return destroyAnimation(lastNode);
  }

  // appear 动画
  if (nextNode && !lastNode) {
    return appearAnimation(nextNode);
  }

  // update 动画
  return updateAnimation(nextNode, lastNode);
}

function createAnimation(parent, nextChildren, lastChildren) {
  const { shape: parentShape } = parent;

  let nextSibling: IChildNode = parentShape.firstChild;
  const childrenAnimation = [];
  Children.compare(nextChildren, lastChildren, (nextNode, lastNode) => {
    const animator = createAnimator(nextNode, lastNode);

    // 更新文档流
    if (nextNode && !lastNode) {
      Children.map(nextNode, (node) => {
        if (!node) return;
        const { shape } = node;
        if (nextSibling) {
          parentShape.insertBefore(shape, nextSibling);
        } else {
          parentShape.appendChild(shape);
        }
      });
    } else if (nextNode && lastNode) {
      const { shape } = nextNode;
      nextSibling = shape.nextSibling;
    }

    if (animator) {
      Children.map(animator, (item) => {
        if (!item) return;
        childrenAnimation.push(item);
      });
    }
    return animator;
  });

  return childrenAnimation;
}

export { createAnimation };

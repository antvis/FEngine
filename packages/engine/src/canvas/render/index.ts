import { isBoolean, isNil, mix, omit, pick } from '@antv/util';
import { convertToPath, DisplayObject } from '@antv/g';
import Children from '../../children';
import Component from '../../component';
import renderJSXElement from './renderJSXElement';
import { createShape, addEvent } from './createShape';
import { createNodeTree, fillElementLayout } from './renderLayout';
import computeLayout from '../css-layout';
import Timeline from '../timeline';

function doAnimate(shape: DisplayObject, effect) {
  if (!effect) return null;
  const { start, end, easing, duration, delay, iterations } = effect;
  // TODO: JSON render 不执行动画
  const animation = shape.animate([start, end], {
    fill: 'both',
    easing,
    duration,
    delay,
    iterations,
  });
  return animation;
}

// 创建元素
function createElement(element, container, component) {
  return Children.map(element, (item) => {
    if (!item) return item;
    const { ref, type, props, style } = item;
    const { children, animation: animationEffect } = props;

    const shape = createShape(type, props, style);

    item.shape = shape;
    container.appendChild(shape);

    const { animate, timeline } = component;
    const appearEffect = animationEffect && animationEffect.appear;

    if (animate && appearEffect) {
      // 执行动画
      const animation = doAnimate(shape, appearEffect);
      timeline.add(animation);
    }

    // 设置ref
    if (ref) {
      ref.current = shape;
    }

    // 继续创建自元素
    createElement(children, shape, component);
  });
}

// 删除元素
function deleteElement(element, component) {
  const { animate, timeline } = component;

  const childTimeline = new Timeline();
  Children.map(element, (item) => {
    if (!item) return item;
    const { props, shape, children } = item;
    const { animation: animationEffect } = props;

    const subChildTimeline = deleteElement(children, component);
    childTimeline.concat(subChildTimeline);
    const leaveEffect = animationEffect && animationEffect.leave;
    if (animate && leaveEffect) {
      const animation = doAnimate(shape, leaveEffect);
      timeline.add(animation);
      childTimeline.add(animation);

      // 当子元素和自身动画全部都结束时，把元素从文档里删除
      subChildTimeline.add(animation);
      subChildTimeline.onEnd(() => {
        shape.remove();
      });
    } else {
      shape.remove();
    }
  });
  return childTimeline;
}

// 更新元素
function updateElement(nextElement, lastElement, component) {
  const { props: nextProps, style: nextStyle } = nextElement;
  const { props: lastProps, style: lastStyle, shape } = lastElement;
  const { animation: nextAnimationEffect, children: nextChildren } = nextProps;
  const { children: lastChildren } = lastProps;
  const { animate, timeline } = component;
  const updateEffect = nextAnimationEffect && nextAnimationEffect.update;
  const updateEffectProperty = updateEffect?.property;

  // 保留图形引用
  nextElement.shape = shape;

  // 移除原先事件，添加新事件
  shape.removeAllEventListeners();
  addEvent(shape, nextProps);

  if (animate && updateEffect) {
    // 需要构造动画起始和结束的属性
    const startStyle = pick(lastStyle, updateEffectProperty || []);
    const endStyle = pick(nextStyle, updateEffectProperty || []);
    // 踢掉动画的属性
    mix(shape.style, omit(nextStyle, updateEffectProperty || []));
    // 执行动画
    const animation = doAnimate(shape, {
      ...updateEffect,
      start: {
        ...startStyle,
        ...updateEffect.start,
      },
      end: {
        ...endStyle,
        ...updateEffect.end,
      },
    });
    timeline.add(animation);
  } else {
    mix(shape.style, nextStyle);
  }

  // 继续比较子元素
  renderElement(nextChildren, lastChildren, shape, component);
}

// 类型变化
function morphElement(nextElement, lastElement, container, component) {
  const { props: nextProps, shape: nextShape, style: nextStyle } = nextElement;
  const { shape: lastShape } = lastElement;

  const { animation: nextAnimationEffect } = nextProps;
  const { animate, timeline } = component;

  const lastPath = convertToPath(lastShape);
  const nextPath = convertToPath(nextShape);

  const pathShape = createShape(
    'path',
    {},
    {
      ...nextStyle,
    }
  );
  lastShape.replaceWith(pathShape);

  const updateEffect = nextAnimationEffect && nextAnimationEffect.update;

  if (animate && updateEffect) {
    const { start, end } = updateEffect;
    const animation = doAnimate(pathShape, {
      ...updateEffect,
      start: { ...start, path: lastPath },
      end: { ...end, path: nextPath },
    });
    animation.onfinish = function() {
      pathShape.replaceWith(nextShape);
    };
    timeline.add(animation);
  }
}

// function changeTypeToGroup(nextGroupElement, lastShapeElement) {
//   const { key, type, ref, props: groupProps, _cache: _groupCache } = nextGroupElement;
//   const { type: lastType, _cache: _lastCache } = lastShapeElement;

//   const { children: groupChildren } = groupProps;

//   // let existTransform = false;
//   const children = Children.map(groupChildren, (nextElement) => {
//     if (!nextElement) return nextElement;
//     const { key, ref, type: nextType, props: nextProps, _cache: _nextCache } = nextElement;
//     // if (nextType === 'group') {
//     //   return changeTypeToGroup(nextElement, lastShapeElement);
//     // }
//     if (nextType !== lastType) {
//       return morphElement(nextElement, lastShapeElement);
//     }
//     // existTransform = true;
//     const { animation: nextAnimation, ...nextReceiveProps } = nextProps;
//     const animation = nextAnimation && nextAnimation.update;
//     return {
//       ref,
//       key,
//       type: nextType,
//       props: nextReceiveProps,
//       _cache: mix(_nextCache, _lastCache),
//       animation,
//       status: ELEMENT_UPDATE,
//     };
//   });

//   return {
//     key,
//     type,
//     ref,
//     props: {
//       ...groupProps,
//       children,
//     },
//     _cache: _groupCache,
//     status: ELEMENT_UPDATE,
//   };
// }

// function changeTypeFromGroup(nextShapeElement, lastGroupElement) {
//   const {
//     ref: nextRef,
//     key: nextKey,
//     type: nextType,
//     props: nextShapeProps,
//     _cache: _nextCache,
//   } = nextShapeElement;
//   const { type: lastType, props: lastProps } = lastGroupElement;
//   const { animation: nextAnimation, ...nextReceiveProps } = nextShapeProps;
//   const { children: groupChildren } = lastProps;
//   const animation = nextAnimation && nextAnimation.update;
//   if (!animation) {
//     // return [deleteElement(lastGroupElement), appearElement[nextShapeElement]];
//   }

//   let transformChild = null;
//   const children = Children.map(groupChildren, (child) => {
//     if (!child) return child;
//     const { type: childType, _cache: _childCache } = child;
//     if (childType !== nextType) {
//       // TODO: child 形变
//       return deleteElement(child);
//     }
//     if (!transformChild) {
//       transformChild = child;
//     }
//     return {
//       type: nextType,
//       props: nextShapeProps,
//       _cache: _childCache,
//       animation,
//       status: ELEMENT_UPDATE,
//     };
//   });

//   if (!transformChild) {
//     // return [deleteElement(lastGroupElement), appearElement(nextShapeElement)];
//   }

//   const nextElement = {
//     ref: nextRef,
//     key: nextKey,
//     type: nextType,
//     props: nextReceiveProps,
//     _cache: mix(_nextCache, transformChild._cache),
//     animation,
//     status: ELEMENT_UPDATE,
//   };

//   // 保留group 结构
//   return [
//     {
//       type: lastType,
//       props: {
//         ...lastProps,
//         children,
//       },
//       status: ELEMENT_DELETE,
//     },
//     nextElement,
//   ];
// }

function changeElementType(nextElement, lastElement, container, component) {
  const { type: nextType, props: nextProps, style } = nextElement;
  const { type: lastType } = lastElement;
  nextElement.shape = createShape(nextType, nextProps, style);

  // if (nextType === 'group') {
  //   return changeTypeToGroup(nextElement, lastElement);
  // }

  // if (lastType === 'group') {
  //   return changeTypeFromGroup(nextElement, lastElement);
  // }

  // 都不是group, 形变动画
  return morphElement(nextElement, lastElement, container, component);
}

function renderElement(nextElements, lastElements, container, component: Component) {
  Children.compare(nextElements, lastElements, (nextElement, lastElement) => {
    // 都为空
    if (!nextElement && !lastElement) {
      return;
    }
    // 新增
    if (!lastElement) {
      createElement(nextElement, container, component);
      return;
    }
    // 删除
    if (!nextElement) {
      deleteElement(lastElement, component);
      return;
    }

    // 普通的jsx元素, 且都非空
    const { key: nextKey, type: nextType } = nextElement;
    const { key: lastKey, type: lastType } = lastElement;

    // key 值不相等
    if (!isNil(nextKey) && nextKey !== lastKey) {
      deleteElement(lastElement, component);
      createElement(nextElement, container, component);
      return;
    }

    // shape 类型的变化
    if (nextType !== lastType) {
      changeElementType(nextElement, lastElement, container, component);
      return;
    }

    updateElement(nextElement, lastElement, component);
  });
}

function renderShapeGroup(component: Component, newChildren: JSX.Element, animate?: boolean) {
  const {
    context,
    updater,
    children: _lastChildren,
    // @ts-ignore
    transformFrom,
    animate: componentAnimate,
  } = component;

  animate = isBoolean(animate) ? animate : componentAnimate;
  const lastChildren = _lastChildren || (transformFrom && transformFrom.children);
  // children 是 shape 的 jsx 结构, component.render() 返回的结构
  const nextChildren = renderJSXElement(newChildren, context, updater);

  if (!nextChildren) return null;

  // 布局计算
  const nodeTree = createNodeTree(nextChildren, context.px2hd);
  computeLayout(nodeTree);
  fillElementLayout(nodeTree);

  // 以组件维度控制是否需要动画
  component.animate = animate;
  renderElement(nextChildren, lastChildren, component.container, component);
  component.animate = componentAnimate;
  return nextChildren;
}

function renderShape(component: Component, newChildren: JSX.Element, animate?: boolean) {
  const child = renderShapeGroup(component, newChildren, animate);
  const { shape } = child;
  return shape;
}
export { renderShape, renderShapeGroup };

import { JSX } from '../../jsx/jsx-namespace';
import { isBoolean, isNil, pick } from '@antv/util';
import { convertToPath, DisplayObject } from '@antv/g';
import Children from '../../children';
import Component from '../../component';
import renderJSXElement from './renderJSXElement';
import { createShape } from './createShape';
import { createNodeTree, fillElementLayout } from './renderLayout';
import computeLayout from '../css-layout';
import Timeline from '../timeline';

function doAnimate(shape: DisplayObject, effect) {
  if (!effect) return null;
  const { start, end, easing, duration, delay, iterations, onFrame, onEnd, clip } = effect;

  // 裁剪动画 TODO:未测试
  // if (clip) {
  //   const { type, attrs, style, start: clipStart, end: clipEnd } = clip;
  //   const clipElement = createShape(
  //     type,
  //     {},
  //     {
  //       ...attrs,
  //       ...style,
  //       ...clipStart,
  //     }
  //   );
  //   shape.style.clipPath = clipElement;
  //   clipElement.animate([clipStart, clipEnd], {
  //     fill: 'both',
  //     easing,
  //     duration,
  //     delay,
  //     iterations,
  //   });
  // }
  // TODO: JSON render 不执行动画
  const animation = shape.animate([start, end], {
    fill: 'both',
    easing,
    duration,
    delay,
    iterations,
  });

  if (!animation) return null;

  animation.onfinish = onEnd;
  animation.onframe = onFrame;
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
      const endStyle = pick(style, appearEffect.property || []);
      // 执行动画
      const animation = doAnimate(shape, {
        ...appearEffect,
        end: {
          ...endStyle,
          ...appearEffect.end,
        },
      });
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
    }
    subChildTimeline.onEnd(() => {
      shape.remove();
    });
  });
  return childTimeline;
}

// 更新元素
function updateElement(nextElement, lastElement, container, component) {
  // 普通的jsx元素, 且都非空
  const { key: nextKey, type: nextType } = nextElement;
  const { key: lastKey, type: lastType } = lastElement;

  // key 值不相等
  if (!isNil(nextKey) && nextKey !== lastKey) {
    deleteElement(lastElement, component);
    createElement(nextElement, container, component);
    return;
  }

  if (nextType === lastType) {
    changeElement(nextElement, lastElement, container, component);
    return;
  }
  // shape 类型的变化
  changeElementType(nextElement, lastElement, container, component);
}

// 执行元素变化
function changeElement(nextElement, lastElement, container, component) {
  const { type: nextType, props: nextProps, style: nextStyle } = nextElement;
  const { props: lastProps, style: lastStyle, shape: lastShape } = lastElement;
  const { animation: nextAnimationEffect, children: nextChildren } = nextProps;
  const { children: lastChildren } = lastProps;
  const { animate, timeline } = component;
  const updateEffect = nextAnimationEffect && nextAnimationEffect.update;
  const updateEffectProperty = updateEffect?.property;

  // 因为其他样式可能有变化，这里要重新创建
  const resetStyle = Object.keys(lastElement.style).reduce((prev, cur) => {
    prev[cur] = '';
    return prev;
  }, {});

  const mergedStyle = Object.assign(resetStyle, nextStyle);
  Object.assign(lastShape.style, mergedStyle);

  nextElement.shape = lastShape;

  if (animate && updateEffect) {
    // 需要构造动画起始和结束的属性
    const startStyle = pick(lastStyle, updateEffectProperty || []);
    const endStyle = pick(nextStyle, updateEffectProperty || []);

    // 执行动画
    const animation = doAnimate(lastShape, {
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
  }

  // 继续比较子元素
  renderElement(nextChildren, lastChildren, lastShape, component);
}

function changeElementType(nextElement, lastElement, container, component) {
  const { type: nextType } = nextElement;
  const { type: lastType } = lastElement;
  if (nextType === 'group') {
    return changeTypeToGroup(nextElement, lastElement, container, component);
  }

  if (lastType === 'group') {
    return changeTypeFromGroup(nextElement, lastElement, container, component);
  }

  // 都不是group, 形变动画
  return morphElement(nextElement, lastElement, container, component);
}

// 类型变化
function morphElement(nextElement, lastElement, container, component) {
  const { type: nextType, props: nextProps, style: nextStyle } = nextElement;
  const { shape: lastShape } = lastElement;

  const { animation: nextAnimationEffect } = nextProps;
  const { animate, timeline } = component;

  const nextShape = createShape(nextType, nextProps, nextStyle);
  nextElement.shape = nextShape;

  const lastPath = convertToPath(lastShape);
  const nextPath = convertToPath(nextShape);

  const pathShape = createShape(
    'path',
    {},
    {
      ...nextStyle,
      path: '',
    }
  );
  lastShape.remove();
  container.appendChild(pathShape);

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

function changeTypeToGroup(
  nextElement: JSX.Element,
  lastElement: JSX.Element,
  container,
  component
) {
  const { props: nextProps } = nextElement;
  const { type: lastType } = lastElement;
  const { children: groupChildren } = nextProps;

  // 处理 group 下面子元素的变化
  Children.map(groupChildren, (child) => {
    if (!child) return child;
    const { type: childType } = child;

    if (childType !== lastType) {
      return morphElement(child, lastElement, container, component);
    }
    changeElement(child, lastElement, container, component);
  });
}

function changeTypeFromGroup(
  nextElement: JSX.Element,
  lastElement: JSX.Element,
  container,
  component
) {
  const { type: nextType } = nextElement;
  const { props: lastProps } = lastElement;
  const { children: groupChildren } = lastProps;

  // 处理 group 下面子元素的变化
  Children.map(groupChildren, (child) => {
    if (!child) return child;
    const { type: childType } = child;

    if (childType !== nextType) {
      return morphElement(nextElement, child, container, component);
    }
    changeElement(nextElement, child, container, component);
  });
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

    updateElement(nextElement, lastElement, container, component);
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

  let lastChildren;

  if (_lastChildren) {
    lastChildren = _lastChildren;
  } else if (transformFrom && transformFrom.children) {
    lastChildren = transformFrom.children;
    transformFrom.children = null;
  }

  // children 是 shape 的 jsx 结构, component.render() 返回的结构
  const nextChildren = renderJSXElement(newChildren, context, updater);

  if (!nextChildren) return null;

  // 布局计算
  const nodeTree = createNodeTree(nextChildren, context);
  computeLayout(nodeTree);
  fillElementLayout(nodeTree);

  // 以组件维度控制是否需要动画
  component.animate = animate;

  renderElement(nextChildren, lastChildren, component.container, component);

  return nextChildren;
}

function renderShape(component: Component, newChildren: JSX.Element, animate?: boolean) {
  const child = renderShapeGroup(component, newChildren, animate);
  const { shape } = child;
  return shape;
}

export { renderShape, renderShapeGroup, deleteElement };

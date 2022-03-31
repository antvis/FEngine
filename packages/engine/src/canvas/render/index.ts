import { convertToPath } from '@antv/g';
import { isBoolean, isNil, mix, omit } from '@antv/util';
import { Canvas as GCanvas } from '@antv/g-mobile';
import Children from '../../children';
import Component from '../../component';
import AnimateController from '../animation/animateController';
import renderJSXElement from './renderJSXElement';
import { createShape, addEvent } from './createShape';
import { createNodeTree, updateNodeTree } from './renderLayout';
import computeLayout from '../css-layout';

interface Options {
  container: GCanvas;
  animateController: AnimateController;
}

function doAnimate(shape, animate) {
  if (!animate) return null;
  const { start, end, easing, duration, delay } = animate;
  const animation = shape.animate([start, end], {
    fill: 'both',
    easing,
    duration,
    delay,
  });
  // const effect = animation.effect;
  // const computedTiming = effect.getComputedTiming();
  // const totalDuration = computedTiming.duration + computedTiming.delay;
  return animation;
}

// 创建元素
function createElement(element, options) {
  const { container, animateController } = options;

  return Children.map(element, (item) => {
    if (!item) return item;
    const { ref, type, props, style } = item;
    const { animation, children } = props;

    const shape = createShape(type, props, style);

    item.shape = shape;
    container.appendChild(shape);

    // 执行动画
    const animator = doAnimate(shape, animation && animation.appear);

    animator && animateController.append(animator);
    // 设置ref
    if (ref) {
      ref.current = shape;
    }

    // 继续创建自元素
    createElement(children, { ...options, container: shape });
  });
}

// 删除元素
function deleteElement(element, options) {
  const { container, animateController } = options;
  Children.map(element, (item) => {
    if (!item) return item;
    const { props, shape, children } = item;
    const { animation } = props;
    const animate = animation && animation.leave;

    deleteElement(children, shape);
    if (animate) {
      const animator = doAnimate(shape, animate);
      animator.onfinish = function() {
        container.removeChild(shape);
      };

      animateController.append(animator);
    } else {
      container.removeChild(shape);
    }
  });
}

// 更新元素
function updateElement(nextElement, lastElement, options) {
  const { props: nextProps, style: nextStyle } = nextElement;
  const { props: lastProps, shape } = lastElement;
  const { animation: nextAnimation, children: nextChildren } = nextProps;
  const { children: lastChildren } = lastProps;
  const { animateController } = options;

  // 保留图形引用
  nextElement.shape = shape;

  // 移除原先事件，添加新事件
  shape.removeAllEventListeners();
  addEvent(shape, nextProps);

  mix(shape.style, omit(nextStyle, nextAnimation?.update?.property || []));

  // 继续比较子元素
  renderShape(nextChildren, lastChildren, { ...options, container: shape });
  // 执行动画
  const animator = doAnimate(shape, nextAnimation && nextAnimation.update);
  animator && animateController.append(animator);
}

// 类型变化
function morphElement(nextElement, lastElement, options) {
  const { props: nextProps, shape: nextShape } = nextElement;
  const { shape: lastShape } = lastElement;

  const { style: nextStyle, animation: nextAnimation } = nextProps;
  const { container, animateController } = options;

  const lastPath = convertToPath(lastShape);
  const nextPath = convertToPath(nextShape);

  const pathShape = createShape(
    'path',
    {
      path: lastPath,
    },
    {
      ...nextStyle,
    }
  );
  container.replaceChild(pathShape, lastShape);

  const animate = nextAnimation && nextAnimation.update;

  if (animate) {
    const { start, end, duration, delay, easing } = animate;
    const animation = pathShape.animate(
      [
        { ...start, path: lastPath },
        { ...end, path: nextPath },
      ],
      {
        fill: 'both',
        duration,
        delay,
        easing,
      }
    );
    animation.onend = function() {
      container.replaceChild(nextShape, pathShape);
    };
    animateController.append(animation);
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

function changeElementType(nextElement, lastElement, options) {
  const { type: nextType, props: nextProps } = nextElement;
  const { type: lastType } = lastElement;
  const { style } = nextProps;
  nextElement.shape = createShape(nextType, nextProps, style);

  // if (nextType === 'group') {
  //   return changeTypeToGroup(nextElement, lastElement);
  // }

  // if (lastType === 'group') {
  //   return changeTypeFromGroup(nextElement, lastElement);
  // }

  // 都不是group, 形变动画
  return morphElement(nextElement, lastElement, options);
}

function renderShape(nextElements, lastElements, options) {
  Children.compare(nextElements, lastElements, (nextElement, lastElement) => {
    // 都为空
    if (!nextElement && !lastElement) {
      return;
    }
    // 新增
    if (!lastElement) {
      createElement(nextElement, options);
      return;
    }
    // 删除
    if (!nextElement) {
      deleteElement(lastElement, options);
      return;
    }

    // 普通的jsx元素, 且都非空
    const { key: nextKey, type: nextType } = nextElement;
    const { key: lastKey, type: lastType } = lastElement;

    // key 值不相等
    if (!isNil(nextKey) && nextKey !== lastKey) {
      deleteElement(lastElement, options);
      createElement(nextElement, options);
      return;
    }

    // shape 类型的变化
    if (nextType !== lastType) {
      changeElementType(nextElement, lastElement, options);
      return;
    }

    updateElement(nextElement, lastElement, options);
  });
}

function renderShapeComponent(component: Component, options: Options, animate?: boolean) {
  const {
    context,
    updater,
    // @ts-ignore
    __lastElement,
    // @ts-ignore
    transformFrom,
    animate: componentAnimate,
    children,
  } = component;
  animate = isBoolean(animate) ? animate : componentAnimate;
  const lastElement = __lastElement || (transformFrom && transformFrom.__lastElement);
  // children 是 shape 的 jsx 结构, component.render() 返回的结构
  const shapeElement = renderJSXElement(children, context, updater);

  // 布局计算
  const nodeTree = createNodeTree(shapeElement);
  computeLayout(nodeTree);
  updateNodeTree(shapeElement, nodeTree);

  // @ts-ignore
  component.__lastElement = shapeElement;

  renderShape(shapeElement, lastElement, options);

  // const renderElement =
  //   animate !== false ? compareRenderTree(shapeElement, lastElement) : shapeElement;
  // // @ts-ignore

  // console.log(renderElement);

  // 生成G的节点树, 存在数组的情况是根节点有变化，之前的树删除，新的树创建
  // if (isArray(renderElement)) {
  //   return renderElement.map((element) => {
  //     return render(element, container, animate);
  //   });
  // } else {
  //   return render(renderElement, container, animate);
  // }
}

function renderComponent(component, options) {
  const { isShapeComponent, children } = component;
  if (isShapeComponent) {
    renderShapeComponent(component, options, false);
    return;
  }
  render(children, options);
}

function render(children, options: Options) {
  Children.map(children, (child) => {
    if (!child) return child;
    const { component } = child;
    if (!component) {
      return child;
    }
    renderComponent(child.component, options);
  });
}

export { render };

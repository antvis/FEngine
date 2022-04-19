import { convertToPath } from '@antv/g';
import { isBoolean, isNil, mix, omit } from '@antv/util';
import Children from '../children';
import Component from '../component';
import { Group, Text, Circle, Ellipse, Rect, Path, Image, Line, Polyline, Polygon } from '@antv/g';
// import Hammer from 'hammer';
import Hammer from '../canvas/event';
import getShapeAttrs from './shapeAttr';

const classMap = {
  group: Group,
  text: Text,
  circle: Circle,
  path: Path,
  ellipse: Ellipse,
  rect: Rect,
  image: Image,
  line: Line,
  polyline: Polyline,
  polygon: Polygon,
};

function addEvent(shape, props) {
  //  支持的事件列表
  const {
    onClick,
    onDbClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchEndOutside,
    onPanStart,
    onPan,
    onPanEnd,
    onPress,
    onSwipe,
  } = props;

  const hammer = new Hammer(shape);

  onClick && hammer.on('click', onClick);
  onDbClick && hammer.on('dbclick', onDbClick);

  onTouchStart && hammer.on('touchstart', onTouchStart);
  onTouchMove && hammer.on('touchmove', onTouchMove);
  onTouchEnd && hammer.on('touchend', onTouchEnd);
  onTouchEndOutside && hammer.on('touchendoutside', onTouchEndOutside);

  onPanStart && hammer.on('panstart', onPanStart);
  onPan && hammer.on('pan', onPan);
  onPanEnd && hammer.on('panend', onPanEnd);
  onPress && hammer.on('press', onPress);
  onSwipe && hammer.on('swipe', onSwipe);
}

function createShape(type: string, style) {
  if (!type) return null;
  const ShapeClass = classMap[type];

  const shape = new ShapeClass({
    style,
  });

  return shape;
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

function mergeLayout(parent, layout) {
  if (!parent || !layout) return layout;
  const { left: parentLeft, top: parentTop } = parent;
  const { left, top } = layout;
  return {
    ...layout,
    left: parentLeft + left,
    top: parentTop + top,
  };
}

// 创建元素
function createElement(component, element, container) {
  return Children.map(element, (item) => {
    if (!item) return item;
    const { type, props, layout } = item;
    const { animation, children } = props;

    // const layout = mergeLayout(container.get('layout'), currentLayout);
    const attrs = getShapeAttrs(type, layout);
    const style = {
      ...props.style,
      ...attrs,
    };
    // console.log(style);

    const shape = createShape(type, style);
    // shape.set('layout', layout);
    item.shape = shape;

    container.appendChild(shape);
    addEvent(shape, props);

    // 执行动画
    const animator = doAnimate(shape, animation && animation.appear);

    // animator && animateController.append(animator);

    // 继续创建自元素
    createElement(component, children, shape);
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
    }
    // {
    //   ...nextStyle,
    // }
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
  // nextElement.shape = createShape(nextType, nextProps, style);

  // if (nextType === 'group') {
  //   return changeTypeToGroup(nextElement, lastElement);
  // }

  // if (lastType === 'group') {
  //   return changeTypeFromGroup(nextElement, lastElement);
  // }

  // 都不是group, 形变动画
  return morphElement(nextElement, lastElement, options);
}

function renderShape(component, nextElements, lastElements) {
  Children.compare(nextElements, lastElements, (nextElement, lastElement) => {
    // 都为空
    if (!nextElement && !lastElement) {
      return;
    }
    // 新增
    if (!lastElement) {
      createElement(component, nextElement, component.container);
      return;
    }
    // 删除
    // if (!nextElement) {
    //   deleteElement(lastElement, options);
    //   return;
    // }

    // // 普通的jsx元素, 且都非空
    // const { key: nextKey, type: nextType } = nextElement;
    // const { key: lastKey, type: lastType } = lastElement;

    // // key 值不相等
    // if (!isNil(nextKey) && nextKey !== lastKey) {
    //   deleteElement(lastElement, options);
    //   createElement(nextElement, options);
    //   return;
    // }

    // // shape 类型的变化
    // if (nextType !== lastType) {
    //   changeElementType(nextElement, lastElement, options);
    //   return;
    // }

    // updateElement(nextElement, lastElement, options);
  });
}

export { renderShape };

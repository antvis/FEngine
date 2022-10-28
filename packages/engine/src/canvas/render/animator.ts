import { DisplayObject } from '@antv/g-lite';
import { omit, pick, isFunction } from '@antv/util';
import EE from '@antv/event-emitter';
import { VNode } from '../vnode';
import { createShape } from './createShape';

class Animator extends EE {
  node: VNode;
  shape: DisplayObject;
  start: any;
  end: any;
  effect: any;

  children: Animator[];

  animate(shape, start, end, effect) {
    this.shape = shape;
    this.start = start;
    this.end = end;
    this.effect = effect;
  }

  play() {
    const { shape, start, end, effect, children } = this;
    const animations = [];
    if (effect) {
      const { property = [], easing, duration, delay, iterations, clip } = effect;

      // 应用样式
      const style = { ...omit(end, property), ...start };
      Object.keys(style).forEach((key) => {
        (shape as DisplayObject).setAttribute(key, style[key]);
      });

      // 开始帧
      const keyframeStart = property.reduce((prev, cur: string) => {
        prev[cur] = start[cur];
        return prev;
      }, {});
      // 结束帧
      const keyframeEnd = pick(end, property);

      const animation = shape.animate([keyframeStart, keyframeEnd], {
        fill: 'both',
        easing,
        duration,
        delay,
        iterations,
      });

      // 过滤无限循环的动画
      if (animation && iterations !== Infinity) {
        animations.push(animation.finished);
      }

      // clip 动画
      if (clip) {
        const clipConfig = isFunction(clip) ? clip(style) : clip;
        if (clipConfig) {
          const {
            type: clipType,
            style: clipStyle,
            property: clipProperty = [],
            easing: clipEasing,
            duration: clipDuration,
            delay: clipDelay,
            iterations: clipIterations,
            start: clipStart,
            end: clipEnd,
          } = clipConfig;

          const clipStartStyle = {
            ...clipStyle,
            ...clipStart,
          };
          const clipEndStyle = {
            ...clipStyle,
            ...clipEnd,
          };
          // 开始帧
          const clipKeyframeStart = clipProperty.reduce((prev, cur: string) => {
            prev[cur] = clipStartStyle[cur];
            return prev;
          }, {});
          // 结束帧
          const clipKeyframeEnd = pick(clipEndStyle, clipProperty);
          const clipShape = createShape(clipType, { style: clipStartStyle });
          shape.setAttribute('clipPath', clipShape);

          // g 中 clip 为全局，且如果要在 clip上加动画，需要手动加到canvas上
          shape.ownerDocument.documentElement.appendChild(clipShape);
          const clipAnimation = clipShape.animate([clipKeyframeStart, clipKeyframeEnd], {
            fill: 'both',
            easing: clipEasing,
            duration: clipDuration,
            delay: clipDelay,
            iterations: clipIterations,
          });

          // 过滤无限循环的动画
          if (clipAnimation && clipIterations !== Infinity) {
            const clipFinished = clipAnimation.finished;
            animations.push(clipFinished);
            clipFinished.then(() => {
              // 删掉 clip
              shape.setAttribute('clipPath', null);
            });
          }
        }
      }
    }

    if (children && children.length) {
      children.forEach((child) => {
        if (!child) return;
        const childAnimator = child.play();
        if (childAnimator) {
          animations.push(childAnimator);
        }
      });
    }

    if (!animations.length) {
      this.emit('end');
      return null;
    }

    const finished = Promise.all(animations);
    finished.then(() => {
      this.emit('end');
    });
    return finished;
  }

  reset() {
    this.shape = null;
    this.start = null;
    this.end = null;
    this.effect = null;
    this.children = null;
  }
}

export default Animator;

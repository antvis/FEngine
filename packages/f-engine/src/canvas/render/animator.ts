import { DisplayObject, IAnimation } from '@antv/g-lite';
import { omit, pick, isFunction } from '@antv/util';
import EE from 'eventemitter3';
import { VNode } from '../vnode';
import { createShape } from './createShape';
import applyStyle from './applyStyle';

class Animator extends EE {
  node: VNode;
  shape: DisplayObject;
  start: any;
  end: any;
  effect: any;
  // 本层动画
  animation: IAnimation;
  // 节点动画树
  children: Animator[];

  animate(shape, start, end, effect) {
    this.shape = shape;
    this.start = start;
    this.end = end;
    this.effect = effect;
  }

  // 首次播放
  loadPlay() {
    const { shape, start, end, effect, children } = this;

    const animations: IAnimation[] = [];
    if (effect) {
      const {
        property = [],
        easing,
        duration,
        delay,
        iterations,
        clip,
        onFrame = () => {},
        onEnd = () => {},
      } = effect;
      // shape 动画
      if (property.length && duration > 0) {
        // 应用样式
        const style = { ...omit(end, property), ...omit(start, property) };
        applyStyle(shape, style);
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
        if (animation) {
          animation.onframe = onFrame;
          animation.onfinish = onEnd;

          // 过滤无限循环的动画
          if (iterations !== Infinity) {
            animations.push(animation);
          }
          this.animation = animation;
        } else {
          // 如果没有执行动画，直接应用结束样式
          applyStyle(shape, end);
        }
      } else {
        // 直接应用结束样式
        applyStyle(shape, end);
      }

      // clip 动画
      if (clip) {
        const clipConfig = isFunction(clip) ? clip(end) : clip;
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

          if (clipProperty.length && (clipDuration || duration) > 0) {
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
              easing: clipEasing || easing,
              duration: clipDuration || duration,
              delay: clipDelay || delay,
              iterations: clipIterations || iterations,
            });

            // 过滤无限循环的动画
            if (clipAnimation) {
              const clipFinished = clipAnimation.finished;
              this.animation = clipAnimation;
              clipFinished.then(() => {
                // 删掉 clip
                shape.setAttribute('clipPath', null);
                clipShape.destroy();
              });
              if ((clipIterations || iterations) !== Infinity) {
                animations.push(clipAnimation);
              }
            } else {
              // 没有动画，直接删掉 clip
              shape.setAttribute('clipPath', null);
              clipShape.destroy();
            }
          }
        }
      }
    }

    if (children && children.length) {
      children.forEach((child) => {
        if (!child) return;
        const childAnimator = child.loadPlay();
        if (childAnimator) {
          animations.push(...childAnimator);
        }
      });
    }

    this.endEmit(animations);
    return animations;
  }

  pause() {
    const { children, animation } = this;
    if (animation) {
      animation.pause();
    }
    if (children && children.length) {
      children.forEach((child) => {
        if (!child) return;
        child.pause();
      });
    }
  }

  endEmit(animations) {
    if (!animations.length) {
      this.emit('end');
      return null;
    }

    const finished = Promise.all(animations.map((d) => d.finished));
    finished.then(() => {
      this.emit('end');
    });
  }

  play() {
    const { children, animation } = this;
    if (animation) {
      animation.play();
    }
    if (children && children.length) {
      children.forEach((child) => {
        if (!child) return;
        child.play();
      });
    }
  }

  reset(shape: DisplayObject) {
    this.shape = shape;
    this.start = null;
    this.end = null;
    this.effect = null;
    this.children = null;
  }
}

export default Animator;

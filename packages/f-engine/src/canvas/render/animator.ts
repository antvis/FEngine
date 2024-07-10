import { DisplayObject, IAnimation } from '@antv/g-lite';
import { omit, pick, isFunction } from '@antv/util';
import EE from 'eventemitter3';
import { VNode } from '../vnode';
import { createShape } from './createShape';
import applyStyle from './applyStyle';

class Animator extends EE {
  vNode: VNode;
  shape: DisplayObject;
  start: any;
  end: any;
  effect: any;
  // 本层动画
  animations: IAnimation[];
  // 节点动画树
  children: Animator[];

  constructor() {
    super();
  }

  animate(shape, start, end, effect) {
    this.shape = shape;
    this.start = start;
    this.end = end;
    this.effect = effect;
  }

  // 首次播放
  run() {
    const { vNode, shape, start, end, effect, children } = this;

    const animations: IAnimation[] = [];
    if (effect) {
      const {
        property = [],
        easing,
        duration,
        delay,
        iterations,
        clip,
        direction = 'normal',
        onFrame,
        onEnd,
      } = effect;
      // shape 动画
      if ((property.length || onFrame) && duration > 0) {
        // 应用样式
        const style = {
          ...omit(start, property),
          ...omit(end, property),
        };
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
          direction,
        });
        if (animation) {
          const onframe = onFrame
            ? (e) => {
                const animationTarget = e.target;
                const effect = animationTarget.effect;
                const timing = effect.getTiming();
                const duration = timing.duration;
                const delay = timing.delay;
                const t = e.currentTime > delay ? (e.currentTime - delay) / duration : 0;
                const shape = effect.target;
                // 动画的一些上下文信息
                const context = {
                  t,
                  start,
                  end,
                  animation: animationTarget,
                  shape,
                };
                applyStyle(shape, onFrame(t, context));
              }
            : null;
          animation.onframe = onframe;
          animation.onfinish =
            onframe || onEnd
              ? (e) => {
                  onframe && onframe(e);
                  onEnd && onEnd(e);
                }
              : null;

          // 过滤无限循环的动画
          if (iterations !== Infinity) {
            animations.push(animation);
          }
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
            deleteAfterComplete = true,
            style: clipStyle,
            property: clipProperty = [],
            easing: clipEasing,
            duration: clipDuration,
            delay: clipDelay,
            iterations: clipIterations,
            start: clipStart,
            end: clipEnd,
            direction: clipDirection,
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
            const clipShape = createShape(clipType, {
              style: clipStartStyle,
            });
            shape.setAttribute('clipPath', clipShape);

            // g 中 clip 为全局，且如果要在 clip上加动画，需要手动加到canvas上
            shape.ownerDocument.documentElement.appendChild(clipShape);
            const clipAnimation = clipShape.animate([clipKeyframeStart, clipKeyframeEnd], {
              fill: 'both',
              easing: clipEasing || easing,
              duration: clipDuration || duration,
              delay: clipDelay || delay,
              iterations: clipIterations || iterations,
              direction: clipDirection || direction,
            });

            // 过滤无限循环的动画
            if (clipAnimation) {
              const clipFinished = clipAnimation.finished;
              deleteAfterComplete &&
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
        const childAnimator = child.run();
        if (childAnimator) {
          animations.push(...childAnimator);
        }
      });
    }
    this.animations = animations;

    // TODO：这段代码放这个位置感觉挺奇怪，看看是否有更合适的地方
    if (vNode) {
      const { component } = vNode;
      if (vNode && vNode.component) {
        // @ts-ignore
        component.animationWillPlay && component.animationWillPlay();
      }
    }
    this.endEmit(animations);
    return animations;
  }

  play() {
    const { animations } = this;
    if (!animations || !animations.length) return;
    animations.forEach((d) => {
      d.play();
    });
  }

  pause() {
    const { animations } = this;
    if (!animations || !animations.length) return;
    animations.forEach((d) => {
      d.pause();
    });
  }

  goTo(frame: number) {
    const { animations } = this;
    if (!animations || !animations.length) return;
    animations.forEach((d) => {
      d.currentTime = frame;
    });
  }

  finish() {
    const { animations } = this;
    if (!animations || !animations.length) return;
    animations.forEach((d) => {
      d.finish();
    });
  }

  setPlaybackRate(speed) {
    const { animations } = this;
    if (!animations || !animations.length) return;
    animations.forEach((d) => {
      d.playbackRate = speed;
    });
  }

  endEmit(animations: IAnimation[]) {
    if (!animations.length) {
      this.emit('end');
      return null;
    }

    const finished = Promise.all(animations.map((d) => d.finished));
    finished.then(() => {
      this.emit('end');
    });
  }

  reset(shape: DisplayObject) {
    this.shape = shape;
    this.start = null;
    this.end = null;
    this.effect = null;
    this.children = null;
  }

  clone() {
    // 浅拷贝
    const animator = new Animator();
    animator.shape = this.shape;
    animator.start = this.start;
    animator.end = this.end;
    animator.effect = this.effect;
    animator.children = this.children;
    animator.vNode = this.vNode;
    return animator;
  }
}

export default Animator;

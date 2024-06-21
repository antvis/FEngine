/* animation timeline control */
import { Group } from '@antv/g-lite';
import Animator from './render/animator';
import EE from 'eventemitter3';

type AnimUnit = {
  animators: Animator[];
  time: number;
};
class Timeline extends EE {
  animator: Animator;
  animUnits: AnimUnit[] = [];
  frame: number = 0;
  playState: string = 'play';
  endFrame: number;
  speed: number;
  time: number;

  constructor(props) {
    super();
    const { animUnits, playState, root, speed = 1, goto } = props;
    this.animator = new Animator();
    const rootShape = new Group();
    this.animator.reset(rootShape);
    root.appendChild(rootShape);

    this.animUnits = animUnits;
    this.playState = playState;
    this.endFrame = animUnits.length - 1;
    this.speed = speed;
    this.time = goto;
  }

  start() {
    const { animator, frame, playState, endFrame, time, speed } = this;
    if (frame < endFrame && playState === 'finish') {
      this.frame = endFrame;
    }
    this.drawFrame();
    animator.on('end', this.next);
    this.animator.run();
    this.setPlayState(playState);
    time && this.goTo(time);
    this.setPlaybackRate(speed);
  }

  next = () => {
    const { frame, playState, endFrame, speed } = this;
    if (playState !== 'play') return;

    this.frame = frame + 1;
    if (frame < endFrame) {
      this.drawFrame();
      this.animator.run();
      this.setPlaybackRate(speed);
    } else {
      this.emit('end');
      this.playState = 'finish';
    }
  };

  drawFrame() {
    const { animator, animUnits, frame } = this;
    const childAnimator = animUnits[frame].animators;
    animator.shape.removeChildren();
    childAnimator.map((d) => {
      animator.shape.appendChild(d?.shape);
    });
    animator.children = childAnimator;
  }

  setPlayState(state) {
    const { animator } = this;
    switch (state) {
      case 'play':
        animator.play();
        break;
      case 'pause':
        animator.pause();
        break;
      case 'finish':
        animator.finish();
        break;
      default:
        break;
    }
  }

  setPlaybackRate(speed) {
    const { animator } = this;
    this.speed = speed;
    animator.setPlaybackRate(speed);
  }

  getPlayState() {
    return this.playState;
  }

  updateState(state) {
    // 播放状态不同
    if (state === 'finish') {
      this.frame = this.endFrame;
      this.drawFrame();
      this.animator.run();
    }

    this.playState = state;
    this.setPlayState(state);
  }

  clear() {
    this.animator = null;
    this.animUnits = [];
    this.playState = null;
    this.endFrame = null;
  }

  goTo(time) {
    const { frame, animUnits, playState } = this;
    let target;

    for (target = 0; target < animUnits.length; target++) {
      const cur = animUnits[target];
      if (time >= cur.time) {
        time -= cur.time; // 计算剩余时间
      } else {
        break;
      }
    }

    // 超出了总时长
    const threshold = 0.0001;
    if (target === animUnits.length && Math.abs(time - threshold) >= 0) {
      this.setPlayState('finish');
      return;
    }

    if (frame !== target) {
      this.frame = target;
      this.drawFrame();
      this.animator.run();
      this.setPlayState(playState);
    }

    this.animator.goTo(time);
  }
}

export default Timeline;

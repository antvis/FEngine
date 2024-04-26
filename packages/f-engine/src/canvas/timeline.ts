/* animation timeline control */
import { Group } from '@antv/g-lite';
import Animator from './render/animator';
import EE from 'eventemitter3';

type AnimaUnit = {
  childrenAnimation: Animator[];
  totalTime: number;
}
class Timeline extends EE {
  animator: Animator;
  animators: AnimaUnit[] = [];
  frame: number = 0;
  playState: string = 'play';
  endFrame: number;

  constructor(props) {
    super();
    const { animators, playState, root } = props;
    this.animator = new Animator();
    const rootShape = new Group();
    this.animator.reset(rootShape);
    root.appendChild(rootShape)

    this.animators = animators;
    this.playState = playState;
    this.endFrame = animators.length - 1;
  }

  start() {
    const { animator, frame, playState, endFrame } = this;
    if (frame < endFrame && playState === "finish") {
      this.frame = endFrame
    }
    this.drawFrame();
    animator.on('end', this.next);
    this.animator.run();
    this.setPlayState(playState);
  }

  next = () => {
    const { frame, playState, endFrame } = this;
    if (playState !== "play") return

    this.frame = frame + 1;
    if (frame < endFrame) {
      this.drawFrame();
      this.animator.run();
    } else {
      this.emit('end');
      this.playState = "finish"
    }
  };


  drawFrame() {
    const { animator, animators, frame } = this;
    const childAnimator = animators[frame].childrenAnimation;
    animator.shape.removeChildren()
    childAnimator.map(d => animator.shape.appendChild(d?.shape))
    animator.children = childAnimator
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

  getPlayState() {
    return this.playState
  }

  updateState(nextProps) {
    // 播放状态不同
    const { state } = nextProps;
    if (state === "finish") {

      this.frame = this.endFrame
      this.drawFrame();
      this.animator.run()
    }
    this.playState = state
    this.setPlayState(state)
  }

  clear() {
    this.animator = null;
    this.animators = [];
    this.playState = null;
    this.endFrame = null
  }

  goTo(time) {
    const { frame, animators, playState } = this;

    const target = animators.findIndex((cur) => {
      if (time - cur.totalTime < 0) {
        return true
      } else {
        time = time - cur?.totalTime
        return false
      }
    })

    if (frame !== target) {
      this.frame = target
      this.drawFrame()
      this.animator.run();
      this.setPlayState(playState)
    }
    console.log(time)
    this.animator.goTo(time)
  }
}

export default Timeline;

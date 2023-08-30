/* animation timeline control */
import { IAnimation } from '@antv/g-lite';
import Player from '../player';
class Timeline {
  animations: IAnimation[][];
  frame: number = 0;
  playState: string = 'play';
  play: Player;
  animators: any[] = [];
  count: number;

  constructor(playComponent) {
    this.animations = [];
    // this.animators = [];
    this.play = playComponent;
    const { playerFrames } = playComponent;
    this.count = playerFrames.length;
    this.frame = 0;
  }

  addAnimators(animator) {
    this.animators[this.frame] = animator;
  }

  setFrame(frame) {
    this.frame = frame;
  }
  setPlayState(state) {
    this.playState = state;
    const { animator } = this.play;
    // const animator = this.animators[this.frame] || this.play.animator;
    // console.log('animator', animator, state);
    switch (state) {
      case 'play':
        animator.play();
        break;
      case 'pause':
        animator.pause();
        break;
      case 'finish':
        // animator.play();
        // console.log('finish');
        animator.finish();
        break;
      default:
        break;
    }
  }

  getPlayState() {
    return this.playState;
  }

  goTo({ index, frame }) {
    const { animator } = this.play;

    animator.setAnimations(this.animations[index]);
    animator.goTo(frame);
    // animator.run();
  }

  add(animation: IAnimation[]) {
    const { frame } = this;
    // if (this.animations[frame]) {
    //   animation.map((d) => d.cancel());
    //   return;
    // }

    this.animations[frame] = animation;
  }

  getAnimation() {
    const { frame } = this;
    return this.animations[frame];
  }

  push(animation: IAnimation[]) {
    const { frame } = this;
    if (!this.animations[frame]) return;

    this.animations[frame] = this.animations[frame].concat(animation);
  }

  pop() {
    const { frame } = this;
    this.animations[frame].pop();
  }

  delete(animation: IAnimation) {
    const { frame } = this;
    if (!animation || !this.animations[frame]) return;
    this.animations[frame].filter((d) => d !== animation);
  }

  replace(next: IAnimation[]) {
    const { frame } = this;
    if (!this.animations[frame]) return;
    const newAnimation = next.map((index) => {
      return this.animations[frame].map((d) => {
        if (index === d) {
          return index;
        }
        return d;
      });
    });

    this.animations = newAnimation;
  }

  playTimeline() {
    const { frame, count, animations, animators } = this;
    console.log(animations, animators);
    // animators[frame].play();
    // if (frame < count - 1)
    //   animators[frame].on('end', () => {
    //     this.frame++;
    //     this.playTimeline();
    //   });
  }
}

export default Timeline;

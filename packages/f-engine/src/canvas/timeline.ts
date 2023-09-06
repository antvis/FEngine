/* animation timeline control */
import { IAnimation } from '@antv/g-lite';
import Player from '../player';
class Timeline {
  animations: IAnimation[][];
  frame: number = 0;
  playState: string = 'play';
  play: Player;

  constructor(playComponent) {
    this.animations = [];
    this.play = playComponent;
  }

  setPlayState(state) {
    this.playState = state;
    const { animator } = this.play;
    switch (state) {
      case 'play':
        animator.play();
        break;
      case 'pause':
        animator.pause();
        break;
      case 'finish':
        animator.play();
        animator.finish();
        break;
      default:
        break;
    }
  }

  getPlayState() {
    return this.playState;
  }

  goTo(frame) {
    if (!frame) return;
    const { animator } = this.play;
    animator.goTo(frame);
  }

  add(animation: IAnimation[]) {
    const { frame } = this;
    if (this.animations[frame]) {
      animation.map((d) => d.cancel());
      return;
    }
    this.animations[frame] = animation;
  }

  getAnimation() {
    const { frame } = this;
    return this.animations[frame];
  }

  push(animation: IAnimation[]) {
    const { frame } = this;
    if (!this.animations[frame]) return;
    this.animations[0] = this.animations[frame].concat(animation);
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
}

export default Timeline;

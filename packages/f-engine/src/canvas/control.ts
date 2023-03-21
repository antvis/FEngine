/* animation timeline control */
import { Animation } from './render/animator';

class Control {
  animations: Animation[][];
  frame: number = 0;

  constructor() {
    this.animations = [];
  }

  add(animation: Animation[]) {
    const { frame } = this;
    if (this.animations[frame]) {
      animation.map((d) => d.animation.cancel());
      return;
    }
    this.animations[frame] = animation;
  }

  getAnimation() {
    const { frame } = this;
    return this.animations[frame];
  }

  concat(animation: Animation[]) {
    const { frame } = this;
    if (!this.animations[frame]) return;
    this.animations[0] = this.animations[frame].concat(animation);
  }

  pop() {
    const { frame } = this;
    this.animations[frame].pop();
  }

  delete(id: string) {
    const { frame } = this;
    if (!id || !this.animations[frame]) return;
    this.animations[frame].filter((d) => d.id != id);
  }

  repaly(next: Animation[]) {
    const { frame } = this;
    if (!this.animations[frame]) return;
    const newAnimation = next.map((index) => {
      return this.animations[frame].map((d) => {
        if (index.id === d.id) {
          return index;
        }
        return d;
      });
    });

    this.animations = newAnimation;
  }
}

export default Control;

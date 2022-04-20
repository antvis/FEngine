import { Animation } from '@antv/g';

class Timeline {
  animations: Animation[];

  constructor() {
    this.reset();
  }

  reset() {
    this.animations = [];
  }

  add(animation: Animation) {
    this.animations.push(animation);
  }

  concat(timeline: Timeline) {
    this.animations = this.animations.concat(timeline.animations);
  }

  onEnd(callback: () => void) {
    // 过滤无限循环的动画
    const animations = this.animations.filter((animation) => {
      if (!animation) return false;
      const timing = animation.effect.getTiming();
      return timing.iterations === Infinity ? false : true;
    });
    Promise.all(animations.map((animation) => animation.finished)).then(callback);
  }
}

export default Timeline;

import { Animation } from '@antv/g';

class AnimateController {
  animateController: Animation[];

  constructor() {
    this.animateController = [];
  }

  append(animation: Animation) {
    this.animateController.push(animation);
  }

  animationEnd(callback: () => void) {
    Promise.all(this.animateController.map((animation) => animation.finished)).then(callback);
  }

  getMaxEndTime() {
    let maxEndTime = 0;
    this.animateController.map((animation) => {
      const endTime = animation.effect.getComputedTiming().endTime;
      if (endTime > maxEndTime) maxEndTime = endTime;
    });
    return maxEndTime;
  }

  getAnimations() {
    return this.animateController;
  }
}

export default AnimateController;

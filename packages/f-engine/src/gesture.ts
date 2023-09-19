import { DisplayObject, Canvas } from '@antv/g-lite';

class Gesture {
  private el: DisplayObject | Canvas;

  constructor(element: DisplayObject | Canvas) {
    this.el = element;
  }

  on(eventName: string, listener: (...args: any[]) => void) {
    if (!eventName) return;
    const { el } = this;
    el.addEventListener(eventName, listener);
  }

  off(eventName: string, listener: (...args: any[]) => void) {
    if (!eventName) return;
    const { el } = this;
    el.removeEventListener(eventName, listener);
  }
}

export default Gesture;

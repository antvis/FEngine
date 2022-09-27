import { DisplayObject, Canvas } from '@antv/g-lite';
import GGesture from '@antv/g-gesture';

const G_SHAPE_EVENT = {
  click: true,
  touchstart: true,
  touchmove: true,
  touchend: true,
  touchendoutside: true,
  dragenter: true,
  dragleave: true,
  dragover: true,
  drop: true,
  dragstart: true,
  drag: true,
  dragend: true,
};

const GESTURE_EVENT = {
  panstart: true,
  pan: true,
  panend: true,
  pressstart: true,
  press: true,
  pressend: true,
  swipe: true,
  pinchstart: true,
  pinch: true,
  pinchend: true,
};

class Gesture {
  private el: DisplayObject | Canvas;
  private gesture: GGesture;

  constructor(element: DisplayObject | Canvas) {
    this.el = element;
    this.gesture = new GGesture(element);
  }

  on(eventName: string, listener: (...args: any[]) => void) {
    const { el, gesture } = this;
    if (G_SHAPE_EVENT[eventName]) {
      el.addEventListener(eventName, listener);
      return;
    }
    if (GESTURE_EVENT[eventName]) {
      gesture.on(eventName, listener);
    }
  }

  off(eventName: string, listener: (...args: any[]) => void) {
    const { el, gesture } = this;
    if (G_SHAPE_EVENT[eventName]) {
      el.removeEventListener(eventName, listener);
      return;
    }
    if (GESTURE_EVENT[eventName]) {
      gesture.off(eventName, listener);
    }
  }
}

export default Gesture;

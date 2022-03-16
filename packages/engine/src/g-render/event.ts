import Hammer from 'hammerjs';

export default class EventController {
  private shape;
  private callback;
  private hammer;
  private dragging: boolean = false;

  constructor(props) {
    const { shape, callback } = props;
    this.shape = shape;
    this.callback = callback;
    this.hammer = new Hammer(shape);
    this.initNativeEvents();
    this.initEvent();
  }

  // 初始化原生事件
  initNativeEvents() {
    const { onClick, touchStart, touchMove, touchEnd } = this.callback;
    if (onClick) {
      this.shape.addEventListener('click', onClick);
    }
    if (touchStart) {
      this.shape.addEventListener('touchstart', touchStart);
    }
    if (touchMove) {
      this.shape.addEventListener('touchmove', touchMove);
    }

    if (touchEnd) {
      this.shape.addEventListener('touchend', touchEnd);
    }
  }

  initEvent() {
    const { onPanStart, onPan, onPanEnd, press, swipe } = this.callback;
    this.hammer.on('panstart panmove panend pancancel press swipe', (e) => {
      if (e.type === 'panstart') {
        onPanStart && onPanStart();
      }

      if (e.type === 'panmove') {
        onPan && onPan();
      }

      if (e.type === 'panend' || e.type === 'pancancel') {
        onPanEnd && onPanEnd();
      }

      if (e.type === 'press') {
        press && press();
      }

      if (e.type === 'swipe') {
        swipe && swipe();
      }
    });
  }
}

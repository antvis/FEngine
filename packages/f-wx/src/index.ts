import { Canvas } from '@antv/f-engine';

function convertTouches(touches) {
  if (!touches) return touches;
  touches.forEach((touch) => {
    touch.pageX = 0;
    touch.pageY = 0;
    touch.clientX = touch.x;
    touch.clientY = touch.y;
  });
  return touches;
}

function dispatchEvent(el, event, type) {
  if (!el || !event) return;
  if (!event.preventDefault) {
    event.preventDefault = function() {};
  }
  event.type = type;
  event.target = el;
  const { touches, changedTouches, detail } = event;
  event.touches = convertTouches(touches);
  event.changedTouches = convertTouches(changedTouches);
  if (detail) {
    event.clientX = detail.x;
    event.clientY = detail.y;
  }
  el.dispatchEvent(event);
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onRender: {
      type: null,
      value: () => {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  ready() {
    const query = wx.createSelectorQuery().in(this);
    query
      .select('.f-canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const { node, width, height } = res[0];
        const { createImage, requestAnimationFrame, cancelAnimationFrame } = node;

        const context = node.getContext('2d');
        const pixelRatio = wx.getSystemInfoSync().pixelRatio;
        // 高清设置
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;
        const children = this.data.onRender(this.data);
        const canvas = new Canvas({
          pixelRatio,
          width,
          height,
          context,
          children,
          // @ts-ignore
          offscreenCanvas: wx.createOffscreenCanvas({ type: '2d' }),
          createImage,
          requestAnimationFrame,
          cancelAnimationFrame,
          isTouchEvent: (e) => e.type.startsWith('touch'),
          isMouseEvent: (e) => e.type.startsWith('mouse'),
        });
        this.canvas = canvas;
        this.canvasEl = canvas.getCanvasEl();
        canvas.render();
      });
  },

  observers: {
    // 处理 update
    '**': function() {
      const { canvas, data } = this;
      if (!canvas) return;
      const children = data.onRender(data);
      canvas.update({
        children,
      });
    },
  },

  lifetimes: {
    detached() {
      const { canvas } = this;
      if (!canvas) return;
      canvas.destroy();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e) {
      dispatchEvent(this.canvasEl, e, 'click');
    },
    touchStart(e) {
      dispatchEvent(this.canvasEl, e, 'touchstart');
    },
    touchMove(e) {
      dispatchEvent(this.canvasEl, e, 'touchmove');
    },
    touchEnd(e) {
      dispatchEvent(this.canvasEl, e, 'touchend');
    },
  },
});

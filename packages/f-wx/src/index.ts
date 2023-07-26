import { Canvas } from '@antv/f-engine';

function wrapEvent(e) {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function() {};
  }
  return e;
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
        const {
          node,
          width,
          height,
          createImage,
          requestAnimationFrame,
          cancelAnimationFrame,
        } = res[0];
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
          offscreenCanvas: node,
          createImage,
          requestAnimationFrame,
          cancelAnimationFrame,
        });
        canvas.render().then(() => {
          this.canvas = canvas;
          this.canvasEl = canvas.getCanvasEl();
        });
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
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      const event = wrapEvent(e);
      // 包装成 touch 对象
      event.touches = [e.detail];
      canvasEl.dispatchEvent('click', event);
    },
    touchStart(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchstart', wrapEvent(e));
    },
    touchMove(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchmove', wrapEvent(e));
    },
    touchEnd(e) {
      const canvasEl = this.canvasEl;
      if (!canvasEl) {
        return;
      }
      canvasEl.dispatchEvent('touchend', wrapEvent(e));
    },
  },
});

import { Canvas } from '@antv/f-engine';
import { createCanvasAdapter } from './adapter';

function convertTouches(touches) {
  if (!touches) return touches;
  touches.forEach((touch) => {
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
  didMount() {
    const { onUpdate, onClear } = this.props;
    onUpdate && onUpdate(this.createChart.bind(this));
    onClear && onClear(this.clear.bind(this));
    this.createChart();
  },
  didUpdate() {
    const { canvas, props } = this;
    if (!canvas) return;
    const { theme, px2hd, reCreateOnUpdate } = props;

    if (reCreateOnUpdate) {
      canvas.destroy();
      this.canvas = null;
      this.createChart();
      return;
    }

    const children = props.onRender(props);
    const updateProps = {
      theme,
      px2hd,
      children,
    };
    canvas.update(updateProps).catch((error) => {
      this.catchError(error);
    });
  },
  didUnmount() {
    this.clear();
  },
  methods: {
    createChart() {
      const { width, height } = this.props;
      const id = `f-web-canvas-${this.$id}`;
      const { pixelRatio: drp = 2, windowWidth = 375 } = my?.getSystemInfoSync();

      const pixelRatio = Math.ceil(drp);
      const rpx2px = windowWidth / 750;

      this.setData({
        width: width * rpx2px * pixelRatio,
        height: height * rpx2px * pixelRatio,
      });

      const { element: canvas, context } = createCanvasAdapter(my.createCanvasContext(id));
      const fCanvas = this.createCanvas({
        width: width * rpx2px,
        height: height * rpx2px,
        pixelRatio,
        context,
        createImage: canvas.createImage.bind(canvas),
        requestAnimationFrame: canvas.requestAnimationFrame.bind(canvas),
        cancelAnimationFrame: canvas.cancelAnimationFrame.bind(canvas),
      });
      fCanvas.render().catch((error) => {
        this.catchError(error);
      });
    },

    clear() {
      const canvas = this.canvas;
      if (!canvas) return;
      const { width, height } = this.props;
      const { rpx2px, pixelRatio } = this.data;
      try {
        canvas.context.ctx.clearRect(
          0,
          0,
          width * rpx2px * pixelRatio,
          height * rpx2px * pixelRatio,
        );
        canvas.destroy();
        this.canvas = null;
      } catch (error) {
        this.catchError(error);
      }
    },

    catchError(error) {
      console.error('图表渲染失败: ', error);
      const { onError } = this.props;
      if (typeof onError === 'function') {
        onError(error);
      }
      throw error;
    },

    createCanvas({
      width,
      height,
      pixelRatio,
      context,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
    }) {
      if (!width || !height) {
        return;
      }
      const { theme, px2hd, onCanvasRender } = this.props;
      const children = this.props.onRender(this.props);
      const canvas = new Canvas({
        pixelRatio,
        width,
        height,
        theme,
        px2hd,
        context,
        children,
        createImage,
        requestAnimationFrame,
        cancelAnimationFrame,
        onRender: () => {
          const query = my.createSelectorQuery();
          query
            .select(`f-web-canvas-${this.$id}`)
            //@ts-ignore
            .node()
            .exec(() => {
              // api 执行结束后的下一个通信才会上屏
              onCanvasRender && onCanvasRender();
            });
        },
        // @ts-ignore
        offscreenCanvas: my.createOffscreenCanvas ? my.createOffscreenCanvas() : null,
        // useNativeClickEvent: false,
        isTouchEvent: (e) => e.type.startsWith('touch'),
        isMouseEvent: (e) => e.type.startsWith('mouse'),
      });
      this.canvas = canvas;
      this.canvasEl = canvas.getCanvasEl();
      return canvas;
    },
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

import { Canvas } from '@antv/f-engine';

function wrapEvent(e) {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function() {};
  }
  return e;
}
const getPixelRatio = () => my.getSystemInfoSync().pixelRatio;

// 判断是否是新版 canvas 所支持的调用方法（AppX 2.7.0 及以上）
const isAppX2CanvasEnv = () =>
  my.canIUse('canvas.onReady') && my.canIUse('createSelectorQuery.return.node');

Component({
  props: {
    onRender: (_props) => {},
    // width height 会作为元素兜底的宽高使用
    width: null,
    height: null,
    type: '2d', // canvas 2d, 基础库 2.7 以上支持
  },
  /**
   * 组件创建时触发
   * 注意：
   *    使用该生命周期，项目配置需启用："component2": true
   */
  onInit() {
    this.setCanvasId();
  },
  didMount() {
    if (!isAppX2CanvasEnv()) {
      console.error('当前基础库版本过低，请升级基础库版本到 2.7.0 或以上。');
    }
  },
  didUpdate() {
    const { canvas, props } = this;
    if (!canvas) return;
    const children = props.onRender(props);
    canvas.update({
      children,
    });
  },
  didUnmount() {
    const { canvas } = this;
    if (!canvas) return;
    canvas.destroy();
  },
  methods: {
    setCanvasId() {
      const pageId = (this.$page && this.$page.$id) || 0;
      const id = `f-canvas-${pageId}-${this.$id}`;
      this.setData({ id });
    },
    onCanvasReady() {
      const { id } = this.data;
      const query = my.createSelectorQuery();
      query
        .select(`#${id}`)
        // @ts-ignore
        .node()
        .exec((res) => {
          if (!res[0]) {
            return;
          }
          const canvas = res[0].node;
          const {
            width,
            height,
            createImage,
            requestAnimationFrame,
            cancelAnimationFrame,
          } = canvas;
          const pixelRatio = getPixelRatio();

          // 高清解决方案
          this.setData(
            {
              width: width * pixelRatio,
              height: height * pixelRatio,
            },
            () => {
              const context = canvas.getContext('2d');
              const fCanvas = this.createCanvas({
                width,
                height,
                pixelRatio,
                context,
                createImage,
                requestAnimationFrame,
                cancelAnimationFrame,
                offscreenCanvas: canvas,
              });
              fCanvas.render();
            },
          );
        });
    },
    createCanvas({
      width,
      height,
      pixelRatio,
      context,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
      offscreenCanvas,
    }) {
      if (!width || !height) {
        return;
      }
      const children = this.props.onRender(this.props);
      const canvas = new Canvas({
        pixelRatio,
        width,
        height,
        context,
        children,
        createImage,
        requestAnimationFrame,
        cancelAnimationFrame,
        offscreenCanvas,
      });
      this.canvas = canvas;
      this.canvasEl = canvas.getCanvasEl();
      return canvas;
    },
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

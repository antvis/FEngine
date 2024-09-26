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
    onError: () => {},
    onCanvasReady: () => {},
    onCanvasRender: () => {},
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
    // 为了兼容未配置 "component2": true 的情况
    if (!this.data.id) {
      this.setCanvasId();
    }
  },
  didUpdate() {
    const { canvas, props } = this;
    if (!canvas) return;
    const { theme, px2hd } = props;
    const children = props.onRender(props);
    canvas.update({
      theme,
      px2hd,
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
      const { onCanvasReady } = this.props;
      onCanvasReady && onCanvasReady();
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
          if (!canvas) {
            this.catchError('获取canvas失败');
            return;
          }

          const { width, height } = canvas;

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
                createImage: canvas.createImage.bind(canvas),
                requestAnimationFrame: canvas.requestAnimationFrame.bind(canvas),
                cancelAnimationFrame: canvas.cancelAnimationFrame.bind(canvas),
              });
              fCanvas.render().catch((error) => {
                this.catchError(error);
              });
            },
          );
        });
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
        onRender: onCanvasRender,
        // @ts-ignore
        offscreenCanvas: my.createOffscreenCanvas(),
        useNativeClickEvent: false,
        isTouchEvent: (e) => e.type.startsWith('touch'),
        isMouseEvent: (e) => e.type.startsWith('mouse'),
      });
      this.canvas = canvas;
      this.canvasEl = canvas.getCanvasEl();
      return canvas;
    },
    click() {
      // 支付宝小程序的 tap 的 event 对象里没有点击的位置信息，拾取不到具体元素，所以关闭 useNativeClickEvent 用 g 里面的 click 实现
      // dispatchEvent(this.canvasEl, e, 'touchstart');
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

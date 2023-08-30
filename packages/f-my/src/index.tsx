import { Canvas } from '@antv/f-engine';

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
        // @ts-ignore
        offscreenCanvas: my.createOffscreenCanvas(),
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

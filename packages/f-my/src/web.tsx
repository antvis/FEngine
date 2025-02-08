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

const getPixelRatio = () => my.getSystemInfoSync().pixelRatio;

Component({
  props: {
    onRender: (_props) => {},
    // width height 会作为元素兜底的宽高使用
    width: null,
    height: null,
    onError: () => {},
    onCanvasReady: () => {},
    onCanvasRender: () => {},
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
    // 为了兼容未配置 "component2": true 的情况
    if (!this.data.id) {
      this.setCanvasId();
    }
    this.onCanvasReady();
  },
  didUpdate() {
    const { canvas, props } = this;
    if (!canvas) return;
    const { theme, px2hd } = props;
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
        .boundingClientRect()
        .exec((res) => {

          if (!res[0]) {
            return;
          }
          const { width, height } = res[0] as {
            width: number;
            height: number;
          };
          const pixelRatio = Math.ceil(getPixelRatio());

          // 高清解决方案
          this.setData(
            {
              width: width * pixelRatio,
              height: height * pixelRatio,
            },
            () => {
              const {
                element: canvas,
                context
              } = createCanvasAdapter(my.createCanvasContext(id));
              try {
                const fCanvas = this.createCanvas({
                  width,
                  height,
                  pixelRatio,
                  context,
                  createImage: canvas.createImage.bind(canvas),
                  requestAnimationFrame: canvas.requestAnimationFrame.bind(canvas),
                  cancelAnimationFrame: canvas.cancelAnimationFrame.bind(canvas),
                });
                fCanvas.render().catch((error) => {debugger
                  this.catchError(error);
                });
              } catch(ex) {
                debugger
              }
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

import Element from './element';
import { Canvas } from '@antv/g-mobile';
import { ADAPTER_ELE_PROPER_NAME } from './utils';
import { AdapterHammer } from './event';

class CanvasAdapter extends Element {
  canvasEle = null;
  constructor(cfg) {
    super(cfg);
    this.set('renderer', cfg.renderer);
    this.canvasEle = new Canvas({
      context: cfg.context,
      renderer: cfg.renderer,
      width: cfg.width,
      height: cfg.height,
      devicePixelRatio: cfg.pixcelRatio,
    });
    this.adapteredEle = this.canvasEle.getRoot();
    // 均代理到canvas节点，事件拿到对应的对象直接找到canvas实例
    this.canvasEle.document[ADAPTER_ELE_PROPER_NAME] = this;
    this.adapteredEle[ADAPTER_ELE_PROPER_NAME] = this;
    this.canvasEle[ADAPTER_ELE_PROPER_NAME] = this;
    this.adapterHammer = new AdapterHammer(this.canvasEle);

    this.set('el', cfg.context.canvas);
  }

  registerEventCallback(...args): void {
    this.canvasEle.dispatchEvent(...args);
  }

  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return cfg;
  }

  changeSize(width: number, height: number) {
    this.canvasEle.changeSize(width, height);
  }

  /**
   * 获取当前的渲染引擎
   * @return 返回当前的渲染引擎
   */
  getRenderer() {
    return this.get('renderer');
  }

  /**
   * 获取画布的 cursor 样式
   * @return {Cursor}
   */
  getCursor() {
    return this.get('cursor');
  }

  /**
   * 设置画布的 cursor 样式
   * @param {Cursor} cursor  cursor 样式
   */
  setCursor(cursor) {
    this.set('cursor', cursor);
    this.canvasEle.setCursor(cursor);
  }

  getPointByClient(clientX: number, clientY: number) {
    return this.canvasEle.getPointByClient(clientX, clientY);
  }

  getClientByPoint(x: number, y: number) {
    return this.canvasEle.getClientByPoint(x, y);
  }

  isCanvas() {
    return true;
  }

  getParent() {
    return null;
  }

  draw() {}

  destroy() {
    this.canvasEle.destroy();
    this.adapterHammer.removeAllListeners();
    this.destroyed = true;
    this.set('destroyed', true);
  }
}

export default CanvasAdapter;

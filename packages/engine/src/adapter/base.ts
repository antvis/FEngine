import { DisplayObject } from '@antv/g';
import { mix } from '@antv/util';
abstract class Base {
  adapteredEle: DisplayObject;
  /**
   * 内部属性，用于 get,set，但是可以用于优化性能使用
   * @type {object}
   */
  cfg: Object;

  /**
   * 是否被销毁
   * @type {boolean}
   */
  destroyed: boolean = false;

  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  getDefaultCfg() {
    return {};
  }

  constructor(cfg) {
    const defaultCfg = this.getDefaultCfg();
    this.cfg = mix(defaultCfg, cfg);
  }

  // 实现接口的方法
  get(name) {
    return this.cfg[name];
  }
  // 实现接口的方法
  set(name, value) {
    this.cfg[name] = value;
  }

  // 实现接口的方法
  destroy() {
    this.cfg = {
      destroyed: true,
    };
    this.off();
    this.destroyed = true;
  }

  invokeAdapterApi(type, ...rest) {
    const result = this.adapteredEle[type]?.(...rest);
    return result;
  }
  abstract on(evt: string, callback: Function, once?: boolean);
  abstract off(evt?: string, callback?: Function);
}

export default Base;

import Rect from './rect';
import { jsx as _jsx } from "@antv/f-engine/jsx-runtime";
Page({
  data: {
    onRenderCanvas: () => {}
  },
  onReady() {
    this.setData({
      onRenderCanvas: () => {
        return this.renderCanvas();
      }
    });

    // 模拟数据更新
    setTimeout(() => {
      this.setData({
        onRenderCanvas: () => {
          return this.renderCanvas();
        }
      });
    }, 2000);
  },
  renderCanvas() {
    return _jsx(Rect, {
      width: 100
    });
    // 如果不使用 jsx, 用下面代码效果也是一样的
    // return createElement(Chart, {
    //   data: data,
    // });
  }
});
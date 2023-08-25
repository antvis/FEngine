
import Rect from './rect';

Page({
  data: {
    onRenderCanvas: () => {},
  },
  onReady() {
    this.setData({
      onRenderCanvas: () => {
        return this.renderCanvas({ width: 100, index: 1 });
      },
    });

    // 模拟数据更新
    setTimeout(() => {
      this.setData({
        onRenderCanvas: () => {
          return this.renderCanvas({ width: 200, index: 2 });
        },
      });
    }, 2000);
  },
  renderCanvas({ width, index }) {
    return <Rect width={width} index={ index } />;
    // 如果不使用 jsx, 用下面代码效果也是一样的
    // return createElement(Chart, {
    //   data: data,
    // });
  },
});

import Rect from './rect';
import { jsx as _jsx } from '@antv/f-engine/jsx-runtime';
Page({
  data: {
    data: {},
  },
  onReady() {
    this.setData({
      data: {
        index: 1,
        width: 100,
      },
    });
    // 模拟数据更新
    setTimeout(() => {
      this.setData({
        data: {
          index: 2,
          width: 200,
        },
      });
    }, 2000);
  },
  onRenderChart(props) {
    const { data } = props;
    return _jsx(Rect, {
      ...data,
    });

    // 如果不使用 jsx, 用下面代码效果也是一样的
    // return createElement(Chart, {
    //   data: data,
    // });
  },
});

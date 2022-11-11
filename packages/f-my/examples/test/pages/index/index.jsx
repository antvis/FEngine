import Rect from './rect';

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
          index: 1,
          width: 100,
        },
      });
    }, 2000);
  },
  onRenderChart(props) {
    const { data } = props;

    return <Rect {...data} />;

    // 如果不使用 jsx, 用下面代码效果也是一样的
    // return createElement(Chart, {
    //   data: data,
    // });
  },
});

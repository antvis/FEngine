
Page({
  // 一定要在 canvas onReady 之后调用
  onCanvasReady() {
    // 使用类似 web 的 querySelector 语法选中对应的 canvas 元素
    // my-canvas 对应 Canvas 标签的 id
    my.createSelectorQuery()
      .select('#my-canvas')
      .node()
      .exec((res) => {
        const canvas = res[0].node;
        // 拿到 Canvas 之后可以使用和 web 相同的 API 来获取并调用 context
        const ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, 100, 100);
      });
  },
  onTap(e){
    console.log(e)
  }
});
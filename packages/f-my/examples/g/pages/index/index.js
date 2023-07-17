import { Canvas, CanvasEvent, Circle, Text } from '@antv/g-lite';
import { createMobileCanvasElement } from '@antv/g-mobile-canvas-element';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';

const isAppX2CanvasEnv = () =>
  my.canIUse('canvas.onReady') && my.canIUse('createSelectorQuery.return.node');

Page({
  onCanvasReady() {
    console.log(isAppX2CanvasEnv()) 
    my.createSelectorQuery()
      .select('#canvas')
      .node()
      .exec((res) => {
        const canvasNode = res[0].node;
        const ctx = canvasNode.getContext('2d');

        const canvasElement = createMobileCanvasElement(ctx);
        const canvasRenderer = new CanvasRenderer();

        const canvas = new Canvas({
          canvas: canvasElement,
          devicePixelRatio: 2,
          renderer: canvasRenderer,
          width: 600,
          height: 500,
          requestAnimationFrame: canvasNode.requestAnimationFrame,
          cancelAnimationFrame: canvasNode.cancelAnimationFrame,
        });

        // create a circle
        const circle = new Circle({
          style: {
            cx: 20,
            cy: 20,
            r: 10,
            fill: '#1890FF',
            stroke: '#F04864',
            lineWidth: 4,
          },
        });

        // create a line of text
        const text = new Text({
          style: {
            x: 100,
            y: 300,
            fontFamily: 'PingFang SC',
            text: '这是测试文本This is text',
            fontSize: 60,
            fill: '#1890FF',
            stroke: '#F04864',
            lineWidth: 5,
          },
        });

        canvas.addEventListener(CanvasEvent.READY, () => {
          canvas.appendChild(circle);
          canvas.appendChild(text);
        });
      });
  },
});

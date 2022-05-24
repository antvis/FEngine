import { createCanvasAdapterInstance } from './util';

describe('element test', () => {
  const { context, canvas } = createCanvasAdapterInstance();
  const group = canvas.addGroup({
    id: 'testGroup',
    attrs: {
      x: 100,
      y: 100,
    },
  });

  const shape = group.addShape('rect', {
    className: 'circle-keyShape',
    attrs: {
      opacity: 1,
      width: 161,
      height: 42,
      stroke: '#096dd9',
      radius: 4,
      key: 'root -0 ',
      x: 0,
      y: 0,
      lineWidth: 10,
    },
  });

  describe('group test', () => {
    it('group attributes', () => {
      expect(group.adapteredEle !== null).toEqual(true);
      expect(group.attrs).toEqual(group.adapteredEle.attributes);
      expect(group.get('parent')).toEqual(canvas);
      expect(group.get('children')).toEqual(group.getChildren());
      expect(group.get('id')).toEqual('testGroup');
    });

    it('group bbox', () => {
      expect(group.getBBox()).toEqual({
        height: 52,
        maxX: 166,
        maxY: 47,
        minX: -5,
        minY: -5,
        width: 171,
        x: -5,
        y: -5,
      });
    });

    it('group cavasBBox', () => {
      expect(group.getCanvasBBox()).toEqual({
        height: 52,
        maxX: 166,
        maxY: 47,
        minX: -5,
        minY: -5,
        width: 171,
        x: -5,
        y: -5,
      });
    });

    it('group matrix', async () => {
      expect(group.getMatrix()).toEqual([1, 0, 0, -0, 1, 0, 0, 0, 1]);
      group.translate(50, 50);
      expect(group.getMatrix()).toEqual([1, 0, 0, -0, 1, 0, 50, 50, 1]);
      group.scale(2, 2);
      expect(group.getMatrix()).toEqual([2, 0, 0, -0, 2, 0, 100, 100, 1]);
      group.rotate(Math.PI / 4);
      expect(group.getMatrix()).toEqual([
        1.4142136157581708,
        1.4142135089880172,
        0,
        -1.4142135089880172,
        1.4142136157581708,
        0,
        1.4210854715202004e-14,
        141.42135620117188,
        1,
      ]);
      group.resetMatrix();
      expect(group.getMatrix()).toEqual([1, 0, 0, -0, 1, 0, 0, 0, 1]);
    });

    it('group crud', () => {
      const tempGroup = group.addGroup();
      const childGroup = tempGroup.addGroup({
        id: 'test',
      });
      expect(tempGroup.getChildren().length).toEqual(1);
      expect(tempGroup.findById('test')).toEqual(childGroup);
      childGroup.remove();
      expect(tempGroup.getChildren().length).toEqual(0);
    });

    it('zIndex toFront toBack', () => {
      // zIndex, toFront
      const tempGroup = canvas.addGroup();
      expect(group.get('zIndex')).toEqual(0);
      group.toFront();
      expect(group.get('zIndex')).toEqual(1);
      group.toBack();
      expect(group.get('zIndex')).toEqual(-1);
      group.setZIndex(10);
      expect(group.get('zIndex')).toEqual(10);
      tempGroup.remove();
    });

    it('group attr', () => {
      group.attr('x', 200);
      expect(group.attr('x')).toEqual(200);
      group.attr({
        x: 100,
        y: 0,
      });
      expect(group.attr('y')).toEqual(0);
    });
    it('group clear', () => {
      group.clear();
      expect(group.getChildren().length).toEqual(0);
    });
  });
  describe('shape test', () => {
    it('shapes', () => {
      group.attr({
        x: 0,
        y: 0,
      });

      const width = 20;
      const height = 20;

      group.addShape('circle', {
        attrs: {
          x: width / 2,
          y: height,
          r: height / 2,
          fill: 'red',
        },
      });

      group.addShape('rect', {
        attrs: {
          x: width / 2,
          y: height * 2,
          width: width,
          height: height,
          fill: 'red',
        },
      });

      group.addShape('ellipse', {
        attrs: {
          x: width / 2,
          y: height * 3,
          rx: width / 2,
          ry: height / 2,
          fill: 'red',
        },
      });

      group.addShape('Image', {
        attrs: {
          x: width / 2,
          y: height * 4,
          img: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
          width,
          height,
        },
      });

      group.addShape('line', {
        attrs: {
          x1: width / 2,
          y1: height * 5,
          x2: 100,
          y2: height * 5,
          stroke: '#F04864',
        },
      });

      group.addShape('path', {
        attrs: {
          x: width / 2,
          y: height * 6,
          path: [
            ['M', 100, 100],
            ['L', 200, 200],
          ],
          stroke: '#F04864',
          fill: 'red',
        },
      });

      group.addShape('Text', {
        attrs: {
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

      group.addShape('polygon', {
        attrs: {
          points: [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100],
          ],
          stroke: '#1890FF',
          lineWidth: 2,
        },
      });

      group.addShape('polyline', {
        attrs: {
          points: [
            [50, 50],
            [100, 50],
            [100, 100],
            [150, 100],
            [150, 150],
            [200, 150],
            [200, 200],
            [250, 200],
            [250, 250],
            [300, 250],
            [300, 300],
            [350, 300],
            [350, 350],
            [400, 350],
            [400, 400],
            [450, 400],
          ],
          stroke: '#1890FF',
          lineWidth: 2,
        },
      });
    });
  });
});

import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import GRender from '../../src/g-render';
import JSONRender from '../../src/json-render';
import { Renderer } from '@antv/g-mobile';

class View extends Component {
  render() {
    return (
      <group>
        <rect
          style={{
            x: 10,
            y: 10,
            width: 80,
            height: 80,
            fill: 'red',
          }}
          onClick={() => {
            console.log('click rect');
          }}
          onPanStart={() => {
            console.log('drag start');
          }}
          onPan={() => {
            console.log('drag');
          }}
          onPanEnd={() => {
            console.log('drag end');
          }}
        />
        <circle
          style={{
            x: 150,
            y: 50,
            r: 40,
            fill: 'red',
          }}
          onTouchStart={() => {
            console.log('touchStart');
          }}
          onTouchMove={() => {
            console.log('touchMove');
          }}
          onTouchEnd={() => {
            console.log('touchEnd');
          }}
        />
        <path
          style={{
            path: [
              ['M', 100, 100],
              ['L', 200, 200],
            ],
            stroke: '#F04864',
          }}
        />
        <ellipse
          style={{
            x: 250,
            y: 50,
            rx: 40,
            ry: 20,
            fill: 'red',
          }}
        />
        <image
          style={{
            x: 300,
            y: 10,
            width: 100,
            height: 100,
            img:
              'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
          }}
        />
      </group>
    );
  }
}

function View1() {
  return (
    <group>
      <line
        style={{
          x1: 400,
          y1: 50,
          x2: 500,
          y2: 50,
          stroke: '#1890FF',
          lineWidth: 2,
          lineDash: [10, 10],
        }}
      />
      <polyline
        style={{
          points: [
            [50, 50],
            [100, 50],
            [100, 100],
            [150, 100],
            [150, 150],
            [200, 150],
            [200, 200],
          ],
          stroke: '#1890FF',
          lineWidth: 2,
        }}
      />
      <polygon
        style={{
          points: [
            [0, 100],
            [100, 100],
            [100, 200],
            [0, 200],
          ],
          stroke: '#1890FF',
          lineWidth: 2,
        }}
      />
      <text
        style={{
          x: 100,
          y: 100,
          fontFamily: 'PingFang SC',
          text: '这是测试文本This is text',
          fontSize: 15,
          fill: '#1890FF',
          stroke: '#F04864',
          lineWidth: 5,
        }}
        onClick={() => {
          console.log('click text');
        }}
      />
    </group>
  );
}

function View2(props) {
  return props.children;
}

describe('Canvas', () => {
  it('g render', async () => {
    const renderer = new Renderer();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
        <View1 />
        <View2>
          <View />
          <View1 />
        </View2>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
  });

  it.skip('json render', async () => {
    const renderer = new JSONRender();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
        <View1 />
        <View2>
          <View />
          <View1 />
        </View2>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    const json = renderer.root;
    expect(json).toEqual({
      type: 'canvas',
      props: {
        children: [
          {
            type: 'group',
            props: {
              children: [
                {
                  type: 'rect',
                  props: {
                    style: { x: 5, y: 5, width: 40, height: 40, fill: 'red' },
                    // onClick: () => {
                    //   console.log('click rect');
                    // },
                    // onPanStart: () => {
                    //   console.log('drag start');
                    // },
                    // onPan: () => {
                    //   console.log('drag');
                    // },
                    // onPanEnd: () => {
                    //   console.log('drag end');
                    // },
                  },
                },
                { type: 'circle', props: { style: { x: 75, y: 25, r: 20, fill: 'red' } } },
                {
                  type: 'path',
                  props: {
                    style: {
                      path: [
                        ['M', 100, 100],
                        ['L', 200, 200],
                      ],
                      stroke: '#F04864',
                    },
                  },
                },
                {
                  type: 'ellipse',
                  props: {
                    style: {
                      x: 125,
                      y: 25,
                      rx: 20,
                      ry: 10,
                      fill: 'red',
                    },
                  },
                },
                {
                  type: 'image',
                  props: {
                    style: {
                      x: 150,
                      y: 5,
                      width: 50,
                      height: 50,
                      img:
                        'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
                    },
                  },
                },
              ],
            },
          },
          {
            type: 'group',
            props: {
              children: [
                {
                  type: 'line',
                  props: {
                    style: {
                      x1: 200,
                      y1: 25,
                      x2: 250,
                      y2: 25,
                      stroke: '#1890FF',
                      lineWidth: 2,
                      lineDash: [10, 10],
                    },
                  },
                },
                {
                  type: 'polyline',
                  props: {
                    style: {
                      points: [
                        [50, 50],
                        [100, 50],
                        [100, 100],
                        [150, 100],
                        [150, 150],
                        [200, 150],
                        [200, 200],
                      ],
                      stroke: '#1890FF',
                      lineWidth: 2,
                    },
                  },
                },
                {
                  type: 'polygon',
                  props: {
                    style: {
                      points: [
                        [0, 100],
                        [100, 100],
                        [100, 200],
                        [0, 200],
                      ],
                      stroke: '#1890FF',
                      lineWidth: 2,
                    },
                  },
                },
                {
                  type: 'text',
                  props: {
                    style: {
                      x: 100,
                      y: 100,
                      fontFamily: 'PingFang SC',
                      text: '这是测试文本This is text',
                      fontSize: 15,
                      fill: '#1890FF',
                      stroke: '#F04864',
                      lineWidth: 5,
                    },
                  },
                },
              ],
            },
          },
          {
            type: 'group',
            props: {
              children: [
                {
                  type: 'rect',
                  props: {
                    style: { x: 5, y: 5, width: 40, height: 40, fill: 'red' },
                    // onClick: () => {
                    //   console.log('click rect');
                    // },
                    // onPanStart: () => {
                    //   console.log('drag start');
                    // },
                    // onPan: () => {
                    //   console.log('drag');
                    // },
                    // onPanEnd: () => {
                    //   console.log('drag end');
                    // },
                  },
                },
                { type: 'circle', props: { style: { x: 75, y: 25, r: 20, fill: 'red' } } },
                {
                  type: 'path',
                  props: {
                    style: {
                      path: [
                        ['M', 100, 100],
                        ['L', 200, 200],
                      ],
                      stroke: '#F04864',
                    },
                  },
                },
                {
                  type: 'ellipse',
                  props: {
                    style: {
                      x: 125,
                      y: 25,
                      rx: 20,
                      ry: 10,
                      fill: 'red',
                    },
                  },
                },
                {
                  type: 'image',
                  props: {
                    style: {
                      x: 150,
                      y: 5,
                      width: 50,
                      height: 50,
                      img:
                        'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
                    },
                  },
                },
              ],
            },
          },
          {
            type: 'group',
            props: {
              children: [
                {
                  type: 'line',
                  props: {
                    style: {
                      x1: 200,
                      y1: 25,
                      x2: 250,
                      y2: 25,
                      stroke: '#1890FF',
                      lineWidth: 2,
                      lineDash: [10, 10],
                    },
                  },
                },
                {
                  type: 'polyline',
                  props: {
                    style: {
                      points: [
                        [50, 50],
                        [100, 50],
                        [100, 100],
                        [150, 100],
                        [150, 150],
                        [200, 150],
                        [200, 200],
                      ],
                      stroke: '#1890FF',
                      lineWidth: 2,
                    },
                  },
                },
                {
                  type: 'polygon',
                  props: {
                    style: {
                      points: [
                        [0, 100],
                        [100, 100],
                        [100, 200],
                        [0, 200],
                      ],
                      stroke: '#1890FF',
                      lineWidth: 2,
                    },
                  },
                },
                {
                  type: 'text',
                  props: {
                    style: {
                      x: 100,
                      y: 100,
                      fontFamily: 'PingFang SC',
                      text: '这是测试文本This is text',
                      fontSize: 15,
                      fill: '#1890FF',
                      stroke: '#F04864',
                      lineWidth: 5,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });
});

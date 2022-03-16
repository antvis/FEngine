import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import GRender from '../../src/g-render';
import JSONRender from '../../src/json-render';

class View extends Component {
  render() {
    return (
      <group>
        <rect
          attrs={{
            x: '10px',
            y: '10px',
            width: '80px',
            height: '80px',
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
          attrs={{
            x: '150px',
            y: '50px',
            r: '40px',
            fill: 'red',
          }}
          touchStart={() => {
            console.log('touchStart');
          }}
          touchMove={() => {
            console.log('touchMove');
          }}
          touchEnd={() => {
            console.log('touchEnd');
          }}
        />
        <path
          attrs={{
            path: [
              ['M', 100, 100],
              ['L', 200, 200],
            ],
            stroke: '#F04864',
          }}
        />
        <ellipse
          attrs={{
            x: '250px',
            y: '50px',
            rx: '40px',
            ry: '20px',
            fill: 'red',
          }}
        />
        <image
          attrs={{
            x: '300px',
            y: '10px',
            width: '100px',
            height: '100px',
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
        attrs={{
          x1: '400px',
          y1: '50px',
          x2: '500px',
          y2: '50px',
          stroke: '#1890FF',
          lineWidth: 2,
          lineDash: [10, 10],
        }}
      />
      <polyline
        attrs={{
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
        attrs={{
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
        attrs={{
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
    const renderer = new GRender({
      context,
    });
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

  it('json render', async () => {
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
                    attrs: { x: 5, y: 5, width: 40, height: 40, fill: 'red' },
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
                { type: 'circle', props: { attrs: { x: 75, y: 25, r: 20, fill: 'red' } } },
                {
                  type: 'path',
                  props: {
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: { x: 5, y: 5, width: 40, height: 40, fill: 'red' },
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
                { type: 'circle', props: { attrs: { x: 75, y: 25, r: 20, fill: 'red' } } },
                {
                  type: 'path',
                  props: {
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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
                    attrs: {
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

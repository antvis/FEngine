import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    return (
      <group
        style={{
          fill: 'yellow',
        }}
      >
        {/* <rect
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
        /> */}
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
        {/* <path
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
        /> */}
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

    await delay(100);

    expect(context).toMatchImageSnapshot();
  });
});

import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    return (
      <group>
        <polyline
          style={{
            points: [
              [40, 50],
              [100, 50],
              [100, 100],
              [150, 100],
              [150, 150],
              [200, 150],
              [200, 200],
            ],
            stroke: 'red',
            lineWidth: 6,
          }}
        />
        <arc
          style={{
            stroke: '#F04864',
            r: 50,
            cx: 150,
            cy: 112.5,
            startAngle: 0,
            endAngle: `${(Math.PI * 4) / 3} rad`,
            anticlockwise: true,
          }}
        />
        <arc
          style={{
            stroke: '#F04864',
            r: 0,
            cx: 10,
            cy: 10,
            startAngle: 0,
            endAngle: `${(Math.PI * 4) / 3} rad`,
            anticlockwise: true,
          }}
        />
        <marker
          style={{
            symbol: 'circle',
            fill: '#F04864',
            radius: 10,
            x: 50,
            y: 100,
          }}
        />
        <sector
          style={{
            stroke: 'black',
            fill: '#F04864',
            cx: 118,
            cy: 97,
            lineWidth: 1,
            r: 59,
            r0: 30,
            radius: [8, 8, 8, 8],
            startAngle: '1.57 rad',
            endAngle: '3.58 rad',
          }}
        />
        <sector
          style={{
            stroke: 'black',
            fill: 'yellow',
            cx: 218,
            cy: 97,
            lineWidth: 1,
            r: 20,
            r0: 0,
            radius: [8, 8, 8, 8],
            startAngle: '2.57 rad',
            endAngle: '3.58 rad',
          }}
        />
      </group>
    );
  }
}

class View1 extends Component {
  render() {
    return (
      <group>
        <marker
          style={{
            fill: '#F04864',
            radius: 10,
            x: 50,
            y: 100,
            symbol: 'arrow',
          }}
        />
        <marker
          style={{
            fill: '#F04864',
            radius: 10,
            x: 150,
            y: 100,
            symbol: 'arrow',
            transformOrigin: 'left top',
            transform: 'rotate(90deg)',
          }}
        />
      </group>
    );
  }
}

describe('Canvas', () => {
  it('arc', async () => {
    const renderer = new Renderer();
    const ref = { current: null };

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View ref={ref} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('arrow', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View1 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

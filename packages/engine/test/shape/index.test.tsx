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
            x: 150,
            y: 112.5,
            endAngle: `${(Math.PI * 4) / 3} rad`,
            anticlockwise: true,
          }}
        />
        <marker
          style={{
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
            x: 118,
            y: 97,
            lineWidth: 1,
            r: 59,
            r0: 30,
            radius: [8, 8, 8, 8],
            startAngle: '1.57 rad',
            endAngle: '3.58 rad',
            anticlockwise: false,
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
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

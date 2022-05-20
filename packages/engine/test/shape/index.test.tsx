import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    return (
      <group>
        <arc
          style={{
            stroke: '#F04864',
            r: 100,
            x: 100,
            y: 100,
            endAngle: Math.PI,
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
            stroke: '#F04864',
            x: 50,
            y: 0,
            lineWidth: 1,
            r: 50,
            r0: 20,
            startAngle: 0,
            endAngle: Math.PI,
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

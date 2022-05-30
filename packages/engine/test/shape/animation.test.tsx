import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    return (
      <sector
        style={{
          stroke: 'black',
          fill: '#F04864',
          x: 118,
          y: 97,
          lineWidth: 1,
          r: 39,
          r0: 30,
          startAngle: '0rad',
          endAngle: '3.58rad',
          anticlockwise: false,
        }}
        animation={{
          appear: {
            easing: 'ease',
            // duration: 3000,
            duration: 2000,
            // iterations: Infinity,
            // easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
            property: ['endAngle'],
            start: {
              endAngle: '0rad',
            },
            end: {
              endAngle: '3.58rad',
            },
          },
        }}
      />
    );
  }
}

describe('Canvas', () => {
  it('custom shape animation', async () => {
    const renderer = new Renderer();
    const ref = { current: null };

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View ref={ref} />
      </Canvas>
    );

    await delay(2000);

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    // expect(context).toMatchImageSnapshot();
  });
});

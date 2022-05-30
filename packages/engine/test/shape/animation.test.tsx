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
            r: 50,
            x: 150,
            y: 112.5,
            endAngle: `${(Math.PI * 4) / 3}rad`,
            // anticlockwise: true,
          }}
          animation={{
            appear: {
              easing: 'ease',
              duration: 5000,
              property: ['endAngle'],
              start: {
                endAngle: '0rad',
              },
              end: {
                endAngle: `${(Math.PI * 4) / 3}rad`,
              },
            },
          }}
        />
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
            endAngle: '3.89rad',
            anticlockwise: true,
          }}
          animation={{
            appear: {
              easing: 'ease',
              duration: 2000,
              property: ['endAngle'],
              start: {
                endAngle: '0rad',
              },
              end: {
                endAngle: '3.89rad',
              },
            },
          }}
        />
      </group>
    );
  }
}

describe('Canvas', () => {
  it('custom shape animation', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
      </Canvas>
    );

    await delay(2000);

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    // expect(context).toMatchImageSnapshot();
  });
});

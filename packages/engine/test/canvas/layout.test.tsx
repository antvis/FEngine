import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile';

class View extends Component {
  render() {
    return (
      <group
        style={{
          x: 50,
          y: 50,
          width: 100,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: ['6px', '6px', '6px', 0],
        }}
      >
        <rect
          style={{
            width: 40,
            height: 40,
            fill: 'red',
          }}
        />
        <circle
          style={{
            r: 40,
            fill: '#000',
          }}
        />
      </group>
    );
  }
}

describe('Canvas', () => {
  it('layout', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
  });
});

import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    return (
      <group
        attrs={{
          x: 50,
          y: 50,
          width: 250,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <rect
          style={{
            width: 40,
            height: 40,
            fill: 'red',
          }}
        />
        {[1, 2].map((d) => (
          <rect
            attrs={{
              width: 40,
              height: 40,
              fill: 'red',
            }}
          />
        ))}
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

import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    const { count, top = 0 } = this.props;
    return (
      <group
        style={{
          left: 33,
          top,
          width: 100,
          height: 100,
          flexDirection: 'row',
        }}
      >
        <rect
          style={{
            // width: 30,
            flex: 1,
            fill: 'red',
          }}
        />
        {new Array(count).fill(0).map((_, id) => (
          <rect
            style={{
              flex: 1,
              fill: id === 1 ? 'green' : 'blue',
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
        <View count={1} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    await delay(1000);

    const update = (
      <Canvas renderer={renderer} context={context}>
        <View count={2} top={10} />
      </Canvas>
    );

    canvas.update(update.props);
  });
});

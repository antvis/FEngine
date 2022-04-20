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
          display: 'flex',
          left: 33,
          top,
          width: 100,
          height: 100,
          flexDirection: 'row',
        }}
      >
        <rect
          style={{
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
        {null}
      </group>
    );
  }
}

describe('Canvas', () => {
  it('layout', async () => {
    const renderer = new Renderer();
    const ref = { current: null };

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View ref={ref} count={1} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    ref.current.container.getChildren()[0].get('style');

    await delay(200);
    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas renderer={renderer} context={context}>
        <View count={2} top={10} />
      </Canvas>
    );

    canvas.update(update.props);
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

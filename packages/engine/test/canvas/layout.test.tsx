import { jsx, Canvas, Component, JSX } from '../../src';
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

class View2 extends Component {
  render() {
    const { count, top = 0 } = this.props;
    return (
      <group
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 300,
          height: 100,
        }}
      >
        {new Array(3).fill(0).map((_, id) => (
          <group
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <circle
              style={{
                width: 25,
                height: 25,
                marginRight: '10px',
                fill: '#bfbfbf',
              }}
            />
            <text
              style={{
                fill: '#808080',
                text: 'a',
              }}
            />
          </group>
        ))}
      </group>
    );
  }
}

class View3 extends Component {
  render() {
    return (
      <group
        style={{
          display: 'flex',
          top: 100,
          left: 100,
        }}
      >
        <line
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 100,
            stroke: 'rgba(202, 215, 239, .2)',
            lineCap: 'round',
            lineWidth: '8px',
          }}
        />
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

  it('text', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View2 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('line', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View3 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

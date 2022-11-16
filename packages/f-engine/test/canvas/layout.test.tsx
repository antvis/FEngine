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
                r: 12.5,
                width: 25,
                height: 25,
                marginRight: '10px',
                fill: '#bfbfbf',
              }}
            />
            <text
              style={{
                fontSize: '24px',
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
    await canvas.render();

    await delay(200);
    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas renderer={renderer} context={context}>
        <View count={2} top={10} />
      </Canvas>
    );

    await canvas.update(update.props);
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('text', async () => {
    const { props } = (
      <Canvas context={context}>
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

  it('text', async () => {
    const { props } = (
      <Canvas context={context}>
        <group
          style={{
            display: 'flex',
            width: '130px',
          }}
        >
          <rect
            style={{
              fill: '#000',
              height: '30px',
            }}
          />
          <group
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {['red', 'blue', '#333333'].map((color) => {
              return (
                <group>
                  <rect
                    style={{
                      width: '60px',
                      height: '60px',
                      fill: color,
                    }}
                  />
                  <text
                    style={{
                      fill: '#000',
                      text: color,
                    }}
                  />
                </group>
              );
            })}
          </group>
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('component layout', async () => {
    class View extends Component {
      render() {
        const { props } = this;
        return props.children;
      }
    }

    class ViewChild extends Component {
      render() {
        const { layout, props } = this;
        const { fill } = props;
        const { width, height } = layout;
        return <rect style={{ fill, width, height }} />;
      }
    }

    const { props } = (
      <Canvas
        context={context}
        style={{
          padding: [10],
        }}
      >
        <group
          style={{
            display: 'flex',
            width: '130px',
            flexDirection: 'row',
          }}
        >
          <group style={{ flex: 1, height: '100px' }}>
            <View>
              <ViewChild fill="red" />
            </View>
          </group>
          <group style={{ flex: 1, height: '100px' }}>
            <ViewChild fill="blue" />
          </group>
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('marker', async () => {
    class View extends Component {
      constructor(props: any, context) {
        super(props, context);
        this.state.selected = true;
      }
      render() {
        const { props } = this;
        if (!this.state.selected) return null;
        return (
          <group
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: 300,
              height: 50,
            }}
          >
            <marker
              style={{
                width: '44px',
                radius: '22px',
                symbol: 'circle',
                lineWidth: '2px',
                stroke: '#fff',
                fill: 'red',
              }}
            />
            <text
              style={{
                text: '文本',
              }}
            ></text>
          </group>
        );
      }
    }

    const { props } = (
      <Canvas context={context}>
        <View />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

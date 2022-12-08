import { jsx, Canvas, Component, Timeline, Fragment } from '../../src';
import { createContext, delay } from '../util';

class Component1 extends Component {
  render() {
    return (
      <rect
        style={{
          x: 100,
          y: 10,
          width: 20,
          height: 20,
          fill: 'red',
        }}
        animation={{
          appear: {
            property: ['x'],
            duration: 100,
          },
        }}
      />
    );
  }
}

class Component2 extends Component {
  render() {
    return (
      <circle
        style={{
          cx: 20,
          cy: 20,
          r: 10,
          fill: 'blue',
        }}
        animation={{
          update: {
            duration: 100,
            property: ['fill'],
          },
        }}
      />
    );
  }
}

class Wrapper extends Component {
  render() {
    return <Component2 />;
  }
}

describe('测试组件变化', () => {
  it('组件切换', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <Timeline>
          <Component1 />
          <Component2 />
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await delay(100);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });

  it('指定 tranformRef', async () => {
    const context = createContext();
    const ref = {};
    const { props } = (
      <Canvas context={context}>
        <Timeline>
          <>
            <Component1 ref={ref} />
          </>
          <Component2 transformFrom={ref} />
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await delay(100);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });

  it('tranformRef 嵌套', async () => {
    const context = createContext();
    const ref = {};
    const { props } = (
      <Canvas context={context}>
        <Timeline>
          <Component1 ref={ref} />
          <Wrapper transformFrom={ref} />
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await delay(100);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});

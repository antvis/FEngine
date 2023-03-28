import { jsx, Canvas, Component, Player, Timeline } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      const { width = '80px', height = '80px' } = this.props;
      return (
        <rect
          style={{
            width,
            height,
            fill: 'red',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 1000,
              property: ['y'],
              start: {
                y: 0,
              },
              end: {
                y: 180,
              },
            },
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'width', 'height'],
            },
            leave: {
              easing: 'easeIn',
              duration: 500,
              property: ['y', 'x'],
              start: {},
              end: {
                y: 0,
                x: 100,
              },
            },
          }}
        />
      );
    }
  }

  class View1 extends Component {
    render() {
      return (
        <circle
          style={{
            cx: '80px',
            cy: '80px',
            fill: 'red',
            r: '50px',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 1000,
              property: ['r'],
              start: {
                r: 0,
              },
              end: {
                r: 25,
              },
            },
            update: {
              easing: 'easeOut',
              duration: 1000,
              property: ['r'],
              start: {
                r: 0,
              },
              end: {
                r: 25,
              },
            },
            leave: {
              easing: 'easeIn',
              duration: 500,
              property: ['r'],
              end: {
                r: 0,
              },
            },
          }}
        />
      );
    }
  }

  class View3 extends Component {
    constructor(props) {
      super(props);
      this.state = {
        width: '80px',
      };
    }

    didMount(): void {
      setTimeout(() => {
        this.setState({
          width: '150px',
        });
      }, 0);
    }

    render() {
      const { width = '80px' } = this.state;
      return (
        <rect
          style={{
            width,
            height: '80px',
            fill: 'red',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 1000,
              property: ['y'],
              start: {
                y: 0,
              },
              end: {
                y: 180,
              },
            },
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'width', 'height'],
            },
            leave: {
              easing: 'easeIn',
              duration: 500,
              property: ['y', 'x'],
              start: {},
              end: {
                y: 0,
                x: 100,
              },
            },
          }}
        />
      );
    }
  }
  it('元素未改变,只有播控props改变', async () => {
    const context = createContext('播控props改变');
    let frame = -1;
    const { props } = (
      <Canvas context={context}>
        <Player
          frame={100}
          state="pause"
          getTotalFrame={(index) => {
            frame = index;
          }}
        >
          <View />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    expect(frame).toEqual(1000);
    await delay(1000);

    expect(context).toMatchImageSnapshot();

    await canvas.update({
      children: (
        <Player frame={100} state="play">
          <View />
        </Player>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });

  it('播控速度& onfinish', async () => {
    const context = createContext('播控props测试');
    const callback = jest.fn();
    const { props } = (
      <Canvas context={context}>
        <Player state="play" speed={0.5} onfinish={callback}>
          <View />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);
    expect(callback.mock.calls.length).toBe(0);
    await delay(1500);
    expect(callback.mock.calls.length).toBe(1);
  });

  it('元素props改变', async () => {
    const context = createContext('元素props改变');
    const { props } = (
      <Canvas context={context}>
        <Player frame={100} state="pause">
          <View />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);

    await canvas.update({
      children: (
        <Player frame={100} state="play">
          <View width={'130px'} />
        </Player>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });

  it('子元素改变', async () => {
    const context = createContext('子元素改变');
    const { props } = (
      <Canvas context={context}>
        <Player frame={100} state="pause">
          <View />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);
    expect(context).toMatchImageSnapshot();

    await canvas.update({
      children: (
        <Player frame={200} state="pause">
          <View1 />
        </Player>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });

  it('部分子元素改变', async () => {
    const context = createContext('部分子元素改变');
    const { props } = (
      <Canvas context={context}>
        <Player frame={100} state="pause">
          <group>
            <View />
            <View1 />
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);
    expect(context).toMatchImageSnapshot();

    // 子元素减少
    await canvas.update({
      children: (
        <Player state="play">
          <group>
            <View />
          </group>
        </Player>
      ),
    });

    await delay(500);

    // 子元素增加
    await canvas.update({
      children: (
        <Player state="play">
          <group>
            <View />
            <View1 />
          </group>
        </Player>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });

  it('元素state改变', async () => {
    const context = createContext('元素props改变');
    const { props } = (
      <Canvas context={context}>
        <Player frame={100} state="pause">
          <View3 />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });
});

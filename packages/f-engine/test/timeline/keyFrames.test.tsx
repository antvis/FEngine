import { jsx, Canvas, Component, Player, Timeline } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      const {
        width = '80px',
        height = '80px',
        opacity = 1,
        fill = 'red',
        visible = true,
        fillFunc,
      } = this.props;
      if (!visible) return;
      return (
        <rect
          style={{
            width,
            height,
            fill: fillFunc ? fillFunc() : fill,
            opacity,
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 500,
              property: ['width'],
            },
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'fill', 'width', 'height'],
            },
          }}
        />
      );
    }
  }

  class View1 extends Component {
    render() {
      const { r = 5, visible = true } = this.props;
      if (!visible) return;
      return (
        <circle
          style={{
            cx: 100,
            cy: 40,
            r,
            fill: 'yellow',
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 500,
              property: ['r'],
            },
            update: {
              easing: 'linear',
              duration: 500,
              property: ['r'],
            },
          }}
        />
      );
    }
  }

  class View3 extends Component {
    render() {
      const {
        width = '80px',
        height = '80px',
        opacity = 1,
        fill = 'red',
        visible = true,
      } = this.props;
      if (!visible) return;
      return (
        <group
          animation={{
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'width', 'height'],
            },
            leave: {
              easing: 'linear',
              duration: 1000,
              property: ['opacity'],
              end: {
                opacity: 0,
              },
            },
          }}
        >
          <rect
            style={{
              width,
              height,
              fill,
            }}
          />
        </group>
      );
    }
  }
  it('子组件', async () => {
    const context = createContext('子组件');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            {
              view: {
                to: {
                  width: '5px',
                },
              },
              view1: {
                to: {
                  r: '5px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
              view1: {
                to: {
                  r: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
              view1: {
                to: {
                  r: '80px',
                },
              },
            },
          ]}
        >
          <group>
            <View key={'view'} width={'5px'} />
            <View1 key={'view1'} r={'5px'}></View1>
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });

  it('props 未变', async () => {
    const context = createContext('props 未变');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
              },
            },
            {},
          ]}
        >
          <View key={'view'} visible={false} opacity={0.5} fill={'#1677FF'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(canvas.container.childNodes[1].childNodes[0].nodeName).toBe('g');
    expect(canvas.container.childNodes[1].childNodes[0].childNodes[0].nodeName).toBe('rect');
    expect(context).toMatchImageSnapshot();
  });

  it('keyFrames', async () => {
    const context = createContext('切片动画');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: false,
                  width: '5px',
                },
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });

  it('pause', async () => {
    const context = createContext('动画暂停');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  it('finish', async () => {
    const context = createContext('动画播放结束');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="finish"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  // 修改 state
  it('暂停完播放', async () => {
    const context = createContext('暂停完播放');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(30);

    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    canvas.update(newProps);
    await delay(800);

    const shape = canvas.container.childNodes[1].childNodes[0].childNodes[0];
    //@ts-ignore 初始状态10px = 5
    expect(Number(shape.style.width)).toBeGreaterThan(5);
  });

  it('播放中finish', async () => {
    const context = createContext('播放中动画finish');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(10);
    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="finish"
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} />
        </Player>
      </Canvas>
    );

    canvas.update(newProps);
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  it('keyFrames-连续变化', async () => {
    const context = createContext('连续变化');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            // 变宽
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 500,
              },
            },
            {},
          ]}
        >
          <View key={'view'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });

  it.skip('leave 动画', async () => {
    const context = createContext('动画 finish');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
              },
            },
            {
              view: {
                to: {
                  visible: false,
                },
              },
            },
          ]}
        >
          <View3 key={'view'} width={'80px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(10);
    expect(context).toMatchImageSnapshot();
  });
});

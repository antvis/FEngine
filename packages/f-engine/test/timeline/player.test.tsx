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
        visible = false,
      } = this.props;
      if (!visible) return;
      return (
        <rect
          style={{
            width,
            height,
            fill,
            opacity,
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 10,
              property: ['width'],
            },
            update: {
              easing: 'linear',
              duration: 10,
              property: ['x', 'fill', 'width', 'height', 'opacity'],
            },
          }}
        />
      );
    }
  }

  it('duration delay', async () => {
    const context = createContext('duration delay');
    const callback = jest.fn();

    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          onend={callback}
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                  width: '40px',
                },
                duration: 500,
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 500,
                delay: 500,
              },
            },
          ]}
        >
          <group>
            <View key={'view'} width={'5px'} />
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    // 传入动画时间生效
    expect(
      //@ts-ignore
      Number(canvas.container.childNodes[1].childNodes[0].childNodes[0].childNodes[0].style.width),
    ).toBeLessThan(30);
    expect(callback.mock.calls.length).toBe(0);
    await delay(1800);
    expect(callback.mock.calls.length).toBe(1);
  });

  it('goTo', async () => {
    const context = createContext('跳转至某时间');
    const callback = jest.fn();

    // 第一帧结束
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={1100}
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 1000,
                delay: 100,
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '160px',
                },
                duration: 800,
                delay: 100,
              },
            },
          ]}
        >
          <group>
            <View key={'view'} visible={false} />
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    expect(context).toMatchImageSnapshot();

    // 第一和二帧中间
    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={1500}
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 1000,
                delay: 100,
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '160px',
                },
                duration: 800,
                delay: 100,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps);
    await delay(100);

    expect(context).toMatchImageSnapshot();

    // 第一帧
    const { props: new2Props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={110}
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 1000,
                delay: 100,
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '160px',
                },
                duration: 800,
                delay: 100,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(new2Props);
    await delay(100);

    expect(context).toMatchImageSnapshot();
  });

  it('speed', async () => {
    const context = createContext('播放速度');

    const { props } = (
      <Canvas context={context}>
        <Player
          speed={3}
          state="play"
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                  width: '40px',
                },
                duration: 500,
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
          ]}
        >
          <group>
            <View key={'view'} visible={false} />
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    // 400ms 就播放完了
    await delay(400);

    expect(
      //@ts-ignore
      Number(canvas.container.childNodes[1].childNodes[0].childNodes[0].childNodes[0].style.width),
    ).toEqual(40);
  });

  it('多组动画回跳', async () => {
    const context = createContext('多组动画回跳');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={2000}
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 400,
              },
            },
            {
              view: {
                to: {
                  width: '200px',
                },
                duration: 800,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    ref.current.goTo(700);
    ref.current.setPlayState('pause');
    await delay(200);
    ref.current.goTo(200);
    ref.current.setPlayState('pause');
    await delay(200);

    ref.current.setPlayState('play');

    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });
});

describe('clip animation', () => {
  class View extends Component {
    render() {
      const {
        width = '80px',
        height = '80px',
        opacity = 1,
        fill = 'red',
        visible = false,
      } = this.props;
      if (!visible) return;
      return (
        <rect
          style={{
            width,
            height,
            fill,
            opacity,
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 200,
              clip: {
                type: 'rect',
                property: ['width'],
                style: {
                  width,
                  height,
                },
                deleteAfterComplete: false,
                start: {
                  width: 0,
                },
                end: {
                  width,
                },
              },
            },
            update: {
              easing: 'linear',
              duration: 10,
              property: ['x', 'fill', 'width', 'height'],
            },
          }}
        />
      );
    }
  }

  it('clip 增加 deleteAfterComplete', async () => {
    const context = createContext('deleteAfterComplete');

    //结束后重播
    const { props } = (
      <Canvas context={context}>
        <Player
          state="finish"
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={10}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps);
    await delay(100);

    expect(context).toMatchImageSnapshot();
  });

  it('跳转超出总时长', async () => {
    const context = createContext('跳转超出总时长');

    //结束后重播
    const { props } = (
      <Canvas context={context}>
        <Player
          state="finish"
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={1200}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps);
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  it('暂停', async () => {
    const context = createContext('暂停');

    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={200}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    expect(context).toMatchImageSnapshot();
  });

  it('结束后从头暂停再播放', async () => {
    const context = createContext('结束后从头播放');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={2000}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={0}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps);
    await delay(100);

    const { props: newProps2 } = (
      <Canvas context={context}>
        <Player
          state="play"
          goTo={0}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps2);
    await delay(100);
    //@ts-ignore
    const shape = canvas.container.childNodes[1].childNodes[0].childNodes[0].style.clipPath;

    expect(Number(shape.style.width)).toBeLessThan(40);
  });

  it('结束后播放', async () => {
    const context = createContext('结束后播放');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={2000}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    // 无动画
    const { props: newProps2 } = (
      <Canvas context={context}>
        <Player
          state="play"
          goTo={2000}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps2);
    await delay(100);
    expect(context).toMatchImageSnapshot();

    // 有动画
    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="play"
          goTo={0}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
                duration: 1000,
              },
            },
          ]}
        >
          <View key={'view'} visible={false} />
        </Player>
      </Canvas>
    );

    await canvas.update(newProps);
    //@ts-ignore
    const shape = canvas.container.childNodes[1].childNodes[0].childNodes[0].style.clipPath;

    expect(Number(shape.style.width)).toBeLessThan(40);
  });
});

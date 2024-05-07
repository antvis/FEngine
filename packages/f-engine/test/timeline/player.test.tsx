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
              property: ['x', 'fill', 'width', 'height'],
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
      Number(canvas.container.childNodes[1].childNodes[0].childNodes[0].style.width),
    ).toBeLessThan(10);
    expect(callback.mock.calls.length).toBe(0);
    await delay(1500);
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
});

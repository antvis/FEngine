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
        visible = false
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
              property: ['x', 'fill','width', 'height'],
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
                duration: 300,
                delay:300
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 500,
                delay:500
              },
            },
          ]}
        >
          <group>
          <View key={'view'}/>
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    
    // 传入动画时间生效
    //@ts-ignore
    expect(Number(canvas.container.childNodes[1].childNodes[0].childNodes[0].style.width)).toBeLessThan(10)    
    expect(callback.mock.calls.length).toBe(0);
    await delay(1500);
    expect(callback.mock.calls.length).toBe(1);
  });

  it.skip('goTo', async () => {
    const context = createContext('跳转至某时间');
    const callback = jest.fn();

    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          goTo={490}
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                  width: '40px',
                },
                duration: 500
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
                duration: 500
              },
            },
          ]}
        >
          <View key={'view'}/>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    
    expect(context).toMatchImageSnapshot();
  });
})
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
              start: {
                width: 0,
              },
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

  it('goTo等于总时长时', async () => {
    const context = createContext('跳转至某时间');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="pause"
          ref={ref}
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
    await delay(10);

    ref.current.goTo(2000);
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

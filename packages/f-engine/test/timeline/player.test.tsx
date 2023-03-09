import { jsx, Canvas, Component, Player } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      return (
        <rect
          style={{
            width: '80px',
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
          }}
        />
      );
    }
  }
  it('animation pause', async () => {
    const context = createContext('animation pause');
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
        <Player frame={500} state="play">
          <View />
        </Player>
      ),
    });

    await delay(3000);
    expect(context).toMatchImageSnapshot();
  });
});

import { jsx, Canvas, Component, Player, Timeline } from '../../src';
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
            update: {
              easing: 'linear',
              duration: 500,
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
          }}
        />
      );
    }
  }

  it('animation pause', async () => {
    const context = createContext('animation pause');
    const { props } = (
      <Canvas context={context}>
        <Timeline autoPlay={false}>
          <Player frame={100} state="pause">
            <View />
          </Player>
          <View1 />
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();

    await canvas.update({
      children: (
        <Timeline>
          <Player frame={500} state="play">
            <View />
          </Player>
        </Timeline>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();

    await canvas.update({
      children: (
        <Timeline>
          <Player frame={300} state="pause">
            <View1 />
          </Player>
        </Timeline>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });
});

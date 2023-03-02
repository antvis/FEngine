import { jsx, Canvas, Component, createRef } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      const { animation } = this.props;
      return (
        <rect
          id="my-circle"
          style={{
            width: '80px',
            height: '80px',
            fill: 'red',
          }}
          animation={animation}
        />
      );
    }
  }
  it('animation pause', async () => {
    const context = createContext('animation pause');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <View
          ref={ref}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 5000,
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
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);
    ref.current.animator.pause();
    await delay(1500);
    expect(
      // @ts-ignore
      Number(canvas.canvas.document.getElementById('my-circle').getAttribute('y')),
    ).toBeLessThan(180);
  });
});

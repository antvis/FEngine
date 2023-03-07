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

describe('frame', () => {
  class View extends Component {
    render() {
      const { animation } = this.props;
      return (
        <group
          animation={{
            appear: {
              easing: 'easeOut',
              delay: 500,
              duration: 1500,
              property: ['y'],
              start: {
                y: 0,
              },
              end: {
                y: 80,
              },
            },
          }}
        >
          <rect
            style={{
              height: '80px',
              fill: 'red',
            }}
            animation={{
              appear: {
                easing: 'easeOut',
                delay: 500,
                duration: 1000,
                property: ['width'],
                start: {
                  width: 0,
                },
                end: {
                  width: 80,
                },
              },
            }}
          />
        </group>
      );
    }
  }
  it('frame', async () => {
    const context = createContext('frame');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <View ref={ref} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    expect(ref.current.animator.totalFrame).toEqual(2000);
    ref.current.animator.pause();
    ref.current.animator.goTo(600);
    expect(ref.current.animator.getCurrentFrame()).toEqual(600);
  });
});

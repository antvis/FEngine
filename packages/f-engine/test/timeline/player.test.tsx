import { jsx, Canvas, Component, createRef } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      const { animation, pause } = this.props;
      return (
        <group
          player={{
            pause,
          }}
        >
          <rect
            id="my-circle"
            style={{
              width: '80px',
              height: '80px',
              fill: 'red',
            }}
            animation={animation}
          />
        </group>
      );
    }
  }
  it.only('clip ainmation', async () => {
    const context = createContext('clip animation');
    const { props } = (
      <Canvas context={context}>
        <View
          pause={false}
          animation={{
            appear: {
              easing: 'quadraticOut',
              duration: 2000,
              clip: {
                type: 'rect',
                property: ['width'],
                style: {
                  x: 0,
                  y: 0,
                  height: 80,
                },
                start: {
                  width: 0,
                },
                end: {
                  width: 80,
                },
              },
            },
            update: {
              //   easing: 'quadraticOut',
              //   duration: 200,
              //   property: ['width'],
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(0);
    // expect(context).toMatchImageSnapshot();
    await canvas.update({
      ...props,
      children: {
        ...props.children,
        props: { ...props.children.props, pause: false },
      },
    });
  });
  it('animation pause', async () => {
    const context = createContext('animation pause');
    const { props } = (
      <Canvas context={context}>
        <View
          pause={true}
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
    expect(context).toMatchImageSnapshot();
    await canvas.update({
      ...props,
      children: {
        ...props.children,
        props: { ...props.children.props, pause: false },
      },
    });
    await delay(400);
    await canvas.update({
      ...props,
      children: {
        ...props.children,
        props: { ...props.children.props, pause: true },
      },
    });

    expect(
      // @ts-ignore
      Number(canvas.canvas.document.getElementById('my-circle').getAttribute('y')),
    ).toBeLessThan(60);
  });
});

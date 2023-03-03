import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

describe('动画', () => {
  it('animation', async () => {
    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            width: 40,
            height: 40,
            fill: 'red',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 50,
              property: ['width'],
            },
            update: {
              easing: 'ease',
              duration: 50,
              delay: 10,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );

    await delay(200);
    const canvas = new Canvas(props);
    await canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();

    // 图形属性变化
    const update = (
      <Canvas context={context}>
        <rect
          style={{
            width: 80,
            height: 40,
            fill: 'red',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 50,
              property: ['width'],
            },
            update: {
              easing: 'ease',
              duration: 50,
              delay: 10,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );
    await canvas.update(update.props);
    await delay(200);
    expect(context).toMatchImageSnapshot();

    // 形变动画
    const update1 = (
      <Canvas context={context}>
        <circle
          style={{
            cx: 80,
            cy: 40,
            r: 20,
            fill: 'red',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 50,
              property: ['width'],
            },
            update: {
              easing: 'ease',
              duration: 50,
              delay: 10,
            },
            leave: {
              end: {
                opacity: 0,
              },
              easing: 'ease',
              duration: 50,
              delay: 10,
              property: ['opacity'],
            },
          }}
        />
      </Canvas>
    );
    await canvas.update(update1.props);
    await delay(200);
    expect(context).toMatchImageSnapshot();

    // 删除动画
    const update2 = <Canvas context={context}></Canvas>;
    await canvas.update(update2.props);

    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('clip animation', async () => {
    const { props } = (
      <Canvas context={context}>
        <group
          animation={{
            appear: {
              easing: 'quadraticOut',
              duration: 1000,
              clip: {
                type: 'circle',
                property: ['r'],
                style: {
                  cx: 40,
                  cy: 40,
                  r: 0,
                },
                start: {
                  r: 5,
                },
                end: {
                  r: 20,
                },
              },
            },
          }}
        >
          <rect
            style={{
              width: 400,
              height: 400,
              fill: 'red',
            }}
          />
        </group>
      </Canvas>
    );

    await delay(200);
    const canvas = new Canvas(props);
    await canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
    await delay(1000);
  });
  it('animate = false', async () => {
    const { props } = (
      <Canvas context={context} animate={false}>
        <rect
          style={{
            width: 40,
            height: 40,
            fill: 'red',
          }}
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 3000,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  it('property empty', async () => {
    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            height: 40,
            fill: 'red',
          }}
          animation={{
            appear: {
              duration: 100,
              end: {
                width: 40,
              },
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  it('duration empty', async () => {
    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            height: 40,
            fill: 'red',
          }}
          animation={{
            appear: {
              property: ['width'],
              end: {
                width: 40,
              },
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  class View extends Component {
    render() {
      const { animation } = this.props;
      return (
        <rect
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

  it('component animation', async () => {
    const { props } = (
      <Canvas context={context}>
        <View
          animation={{
            appear: {
              easing: 'easeOut',
              duration: 100,
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

    await delay(200);
    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('animation中不变的属性', async () => {
    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            width: 40,
            height: 40,
            fill: 'red',
          }}
          animation={{
            update: {
              easing: 'ease',
              duration: 50,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );

    await delay(200);
    const canvas = new Canvas(props);
    await canvas.render();
    await delay(200);

    const update = (
      <Canvas context={context}>
        <rect
          style={{
            width: 80,
            height: 80,
            fill: 'red',
          }}
          animation={{
            update: {
              easing: 'ease',
              duration: 50,
              delay: 10,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );
    await canvas.update(update.props);
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

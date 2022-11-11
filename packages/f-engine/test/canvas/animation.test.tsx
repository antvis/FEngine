import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

describe('动画', () => {
  it('appear', async () => {
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
              duration: 300,
              property: ['width'],
            },
            update: {
              easing: 'ease',
              duration: 300,
              delay: 10,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );

    await delay(500);

    const canvas = new Canvas(props);
    await canvas.render();

    // 图形属性变化
    await delay(1000);
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
              duration: 300,
              property: ['width'],
            },
            update: {
              easing: 'ease',
              duration: 300,
              delay: 10,
              property: ['width'],
            },
          }}
        />
      </Canvas>
    );
    await canvas.update(update.props);

    // 形变动画
    await delay(1000);
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
              duration: 300,
              property: ['width'],
            },
            update: {
              easing: 'ease',
              duration: 300,
              delay: 10,
              // property: ['width'],
            },
            leave: {
              end: {
                opacity: 0,
              },
              easing: 'ease',
              duration: 300,
              delay: 10,
              property: ['opacity'],
            },
          }}
        />
      </Canvas>
    );
    await canvas.update(update1.props);

    // 删除动画
    await delay(1000);
    const update2 = <Canvas context={context}></Canvas>;
    await canvas.update(update2.props);

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
});

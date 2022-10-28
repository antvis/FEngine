import { jsx, Canvas } from '../../src';
import { createContext, delay } from '../util';

describe('clip', () => {
  it('clip', async () => {
    const context = createContext();
    const clip = {
      style: {
        height: 100,
        width: 100,
        x: 100,
        y: 100,
      },
      type: 'rect',
    };
    const { props } = (
      <Canvas context={context}>
        <circle
          style={{
            cx: 100,
            cy: 100,
            r: 100,
            fill: 'red',
            clip,
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('clip function', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <circle
          style={{
            cx: 100,
            cy: 100,
            r: 100,
            fill: 'red',
            clip: (attrs) => {
              return {
                style: {
                  height: attrs.r,
                  width: 100,
                  x: 100,
                  y: 100,
                },
                type: 'rect',
              };
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

describe('clip animation', () => {
  it('clip function', async () => {
    const clipFn = jest.fn();
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <group>
          <rect
            style={{
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              fill: 'red',
            }}
            animation={{
              appear: {
                easing: 'linear',
                clip: {
                  type: 'rect',
                  property: ['width'],
                  duration: 300,
                  style: {
                    x: 0,
                    y: 0,
                    height: 50,
                  },
                  start: {
                    width: 0,
                  },
                  end: {
                    width: 50,
                  },
                },
              },
            }}
          />

          <rect
            attrs={{
              x: 60,
              y: 60,
              width: 50,
              height: 50,
              fill: 'red',
            }}
            animation={{
              appear: {
                easing: 'linear',
                clip: (attrs) => {
                  clipFn(attrs);
                  return {
                    type: 'rect',
                    property: ['width'],
                    duration: 300,
                    style: {
                      // 目前clip坐标为被裁剪图形的局部坐标系下
                      x: 0,
                      y: 0,
                      height: attrs.height,
                    },
                    start: {
                      width: 0,
                    },
                    end: {
                      width: 50,
                    },
                  };
                },
              },
            }}
          />
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    expect(clipFn.mock.calls[0][0]).toMatchObject({
      x: 60,
      y: 60,
      width: 50,
      height: 50,
      fill: 'red',
    });
    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });
});

import { jsx, Canvas } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

describe('clip', () => {
  it('clip', async () => {
    const renderer = new Renderer();

    const clip = {
      attrs: {
        height: 100,
        width: 100,
        x: 120,
        y: 120,
      },
      type: 'rect',
    };
    const { props } = (
      <Canvas renderer={renderer} context={context}>
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
    canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });

  it('clip function', async () => {
    const clipFn = jest.fn();
    const context = createContext();
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <group>
          <rect
            attrs={{
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
                  duration: 1000,
                  attrs: {
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
                    duration: 1000,
                    attrs: {
                      x: 60,
                      y: 60,
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

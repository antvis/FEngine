import { jsx, Canvas, Component, JSX } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';
const Background = (props, context) => {
  const { layout, color } = props;
  return (
    <group>
      <rect
        style={{
          x: 0,
          y: 0,
          height: context.height + context.top,
          width: context.width + context.left,
          fill: 'yellow',
        }}
      />
    </group>
  );
};

describe('Canvas', () => {
  it('resize', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context} width={200} height={100}>
        <group
          style={{
            display: 'flex',
            // width: 100,
            height: 100,
            flexDirection: 'row',
          }}
        >
          <rect
            style={{
              flex: 1,
              fill: 'red',
            }}
          />
          <rect
            style={{
              flex: 1,
              fill: 'green',
            }}
          />
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(200);
    expect(context).toMatchImageSnapshot();

    await canvas.resize(100, 50);
    await delay(200);

    expect(context).toMatchImageSnapshot();
  });

  it('resize context', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context} width={100} height={50}>
        <Background />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(200);

    await canvas.resize(200, 100);
    await delay(200);

    expect(context).toMatchImageSnapshot();
  });
});

import { jsx, Canvas } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

describe('Arc', () => {
  it('Arc 默认', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            startAngle: 0,
            endAngle: 90,
            r: 50,
            stroke: 'red',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('Arc cx cy', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            cx: 50,
            cy: 50,
            startAngle: 0,
            endAngle: 90,
            r: 50,
            stroke: 'red',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('Arc 逆时针', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            cx: 60,
            cy: 60,
            startAngle: 0,
            endAngle: 90,
            r: 50,
            stroke: 'red',
            anticlockwise: true,
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('Arc 整圆', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            cx: 60,
            cy: 60,
            startAngle: 0,
            endAngle: 360,
            r: 50,
            stroke: 'red',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('Arc 弧度', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            startAngle: '0rad',
            endAngle: `${Math.PI / 2}rad`,
            r: 50,
            stroke: 'red',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

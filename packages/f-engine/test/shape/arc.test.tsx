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

  it('Arc 大角', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            cx: 60,
            cy: 60,
            startAngle: -90,
            endAngle: -100,
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

  it('Arc 大角', async () => {
    const { props } = (
      <Canvas context={context}>
        <arc
          style={{
            cx: 60,
            cy: 60,
            startAngle: -90,
            endAngle: -80,
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

  it('角度从非0到0', async () => {
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <arc
          style={{
            cx: 60,
            cy: 60,
            stroke: 'red',
            lineWidth: '8px',
            startAngle: '-1.57rad',
            endAngle: '4.36rad',
            r: 50,
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas context={context} pixelRatio={1}>
        <arc
          style={{
            cx: 60,
            cy: 60,
            stroke: 'red',
            lineWidth: '8px',
            startAngle: '1rad',
            endAngle: '1rad',
            r: 50,
          }}
        />
      </Canvas>
    );
    await canvas.update(update.props);
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

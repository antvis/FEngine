import { jsx, Canvas, Gauge } from '../../../src';
import { createContext, delay } from '../../util';
const context = createContext();

describe('Gauge Chart', () => {
  it('仪表盘', async () => {
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Gauge
          center={{ x: 150, y: 150 }}
          startAngle={Math.PI}
          endAngle={Math.PI * 2}
          percent={0.5}
          r="200px"
          tickCount={6}
          tickOffset="-40px"
          tickLength="20px"
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});

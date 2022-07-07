import { jsx, Canvas, Treemap } from '../../../src';
import { createContext, delay } from '../../util';

const data = [
  {
    name: '贵州茅台',
    value: 0.16,
    rate: 0.1,
  },
  {
    name: '贵州茅台1',
    value: 0.1,
    rate: -0.1,
  },
  {
    name: '五粮液',
    value: 0.13,
    rate: -0.1,
  },
  {
    name: '五粮液',
    value: 0.12,
    rate: -0.01,
  },
  {
    name: '招商银行',
    value: 0.15,
    rate: 0,
  },
  {
    name: '招商银行',
    value: 0.08,
    rate: 0,
  },
  {
    name: '中国平安',
    value: 0.07,
    rate: 0.1,
  },
  {
    name: '中国平安',
    value: 0.06,
    rate: 0.1,
  },
  {
    name: '同花顺',
    value: 0.1,
    rate: 0,
  },
  {
    name: '同花顺',
    value: 0.03,
    rate: 0,
  },
];
describe('Treemap Chart', () => {
  it('旭日图', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Treemap
          data={data}
          yField="value"
          color={{
            field: 'name',
          }}
          space={4}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });
});

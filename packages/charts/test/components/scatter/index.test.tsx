import { jsx, Canvas, Scatter } from '../../../src';
import { createContext, delay } from '../../util';
const context = createContext();

const data = [
  {
    year: '1951 年',
    sales: 20,
    type: 'companyA',
  },
  {
    year: '1952 年',
    sales: 145,
    type: 'companyA',
  },
  {
    year: '1956 年',
    sales: 61,
    type: 'companyA',
  },
  {
    year: '1957 年',
    sales: 52,
    type: 'companyA',
  },
  {
    year: '1958 年',
    sales: 48,
    type: 'companyA',
  },
  {
    year: '1959 年',
    sales: 38,
    type: 'companyA',
  },
  {
    year: '1951 年',
    sales: 60,
    type: 'companyB',
  },
  {
    year: '1952 年',
    sales: 72,
    type: 'companyB',
  },
  {
    year: '1956 年',
    sales: 58,
    type: 'companyB',
  },
];

describe('Scatter Chart', () => {
  it('默认气泡图', async () => {
    const { type, props } = (
      <Canvas context={context} pixelRatio={1}>
        <Scatter
          data={data}
          xField="year"
          yField="sales"
          color={'type'}
          size={{
            field: 'sales',
            range: [10, 20, 30, 40],
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});

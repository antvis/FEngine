import { jsx, Canvas, Funnel } from '../../../src';
import { createContext, delay } from '../../util';
const context = createContext();

const data = [
  { action: '浏览网站', pv: 50000, percent: 1 },
  { action: '放入购物车', pv: 35000, percent: 0.7 },
  { action: '生成订单', pv: 25000, percent: 0.5 },
  { action: '支付订单', pv: 15000, percent: 0.3 },
  { action: '完成交易', pv: 8000, percent: 0.16 },
];

describe('Funnel Chart', () => {
  it('默认金字塔图', async () => {
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Funnel
          data={data}
          xField="action"
          yField="percent"
          color={{
            field: 'action',
            range: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF'],
          }}
          showLabel
          labelCfg={{
            offsetX: 10,
            label: (data, color) => ({
              text: data.action,
              fill: color,
            }),
            guide: (data) => ({
              text: (data.percent * 100).toFixed(0) + '%',
              fill: '#fff',
            }),
          }}
        ></Funnel>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});

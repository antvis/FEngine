import { jsx, Canvas, Column, Area } from '../../../src';
import { Line, Point } from '@antv/f2';
import { createContext, delay } from '../../util';

const data = [
  { key: 'Sports', type: 'a', genre: 'Sports', sold: 5 },
  { key: 'Strategy', type: 'a', genre: 'Strategy', sold: 10 },
  { key: 'Action', type: 'a', genre: 'Action', sold: 20 },
  { key: 'Shooter', type: 'a', genre: 'Shooter', sold: 20 },
  { key: 'Other', type: 'a', genre: 'Other', sold: 40 },
];

const data1 = [
  { x: '2009', y: 1, name: 'Torstein 一个人工作', value: 0 },
  { x: '2010', y: 2, name: 'Grethe 加入', value: 1 },
  { x: '2011', y: 3, name: 'Erik 加入', value: 2 },
  { x: '2012', y: 6, name: 'Gert 加入', value: 2 },
  { x: '2013', y: 7, name: 'Hilde 加入', value: 4 },
  { x: '2014', y: 6, name: 'Guro 加入', value: 3 },
  { x: '2015', y: 5, name: 'Erik left', value: 4 },
  { x: '2016', y: 6, name: 'Anne Jorunn 加入', value: 2 },
  { x: '2017', y: 7, name: 'Hilde T. 加入', value: 5 },
  { x: '2018', y: 8, name: 'Jon Arild 加入', value: 6 },
  { x: '2019', y: 9, name: 'Øystein 加入', value: 7 },
  { x: '2020', y: 10, name: 'Stephane 加入', value: 8 },
  { x: '2021', y: 11, name: 'Anita 加入', value: 11 },
  { x: '2022', y: 11, name: ' ', value: 7 },
];
describe('Column Line Chart', () => {
  it('柱状图加折线图', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Column data={data} xField="genre" yField="sold" color="#2E94B9">
          <Line x="genre" y="sold" color="#F0B775" />
          <Point
            x="genre"
            y="sold"
            style={{
              field: 'medalType',
              fill: '#fff',
              lineWidth: 1,
              stroke: '#F0B775',
            }}
          />
        </Column>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });

  it('折线图加面积图', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Area
          data={data1}
          xField="x"
          yField="value"
          color="#F0B775"
          style={{ lineWidth: 1 }}
          xAxisStyle={{
            label: {
              transform: 'rotate(90deg)',
            },
          }}
        >
          <Line x="x" y="y" color="#D25565" style={{ lineDash: [5, 15, 25] }} />
        </Area>
      </Canvas>
    );
    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });
});

import { jsx } from '@antv/f-engine';
import { Chart, Interval, Legend, Tooltip } from '@antv/f2';

export interface PieProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
}

export default (props: PieProps) => {
  const { data, xField, yField, color } = props;
  return (
    <Chart
      data={data}
      coord={{
        type: 'polar',
        transposed: true,
      }}
    >
      <Legend />
      <Interval adjust="stack" x={xField} y={yField} color={color} />
      <Tooltip />
    </Chart>
  );
};

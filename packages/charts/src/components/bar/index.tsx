import { jsx } from '@antv/f-engine';
import { Chart, Axis, Interval, Legend, Tooltip } from '@antv/f2';

export interface BarProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
}

export default (props: BarProps) => {
  const { data, xField, yField, color } = props;
  return (
    <Chart
      data={data}
      coord={{
        transposed: true,
      }}
    >
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Interval x={xField} y={yField} color={color} />
      <Tooltip />
    </Chart>
  );
};

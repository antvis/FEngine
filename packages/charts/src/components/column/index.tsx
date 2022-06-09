import { jsx } from '@antv/f-engine';
import { Chart, Axis, Interval, Legend, Tooltip } from '@antv/f2';

export interface ColumnProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
}

export default (props: ColumnProps) => {
  const { data, xField, yField, color } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Interval x={xField} y={yField} color={color} />
      <Tooltip />
    </Chart>
  );
};

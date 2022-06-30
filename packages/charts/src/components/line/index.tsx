import { jsx } from '@antv/f-engine';
import { Chart, Axis, Line, Legend, Tooltip } from '@antv/f2';

export interface LineProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
}

export default (props: LineProps) => {
  const { data, xField, yField, color } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Line x={xField} y={yField} color={color} />
      <Tooltip />
    </Chart>
  );
};

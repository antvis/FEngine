import { jsx } from '@antv/f-engine';
import { Chart, Axis, Line, Legend, Tooltip, Area } from '@antv/f2';

export interface AreaProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
  adjust?: string;
}

export default (props: AreaProps) => {
  const { data, xField, yField, color, adjust } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Area x={xField} y={yField} color={color} adjust={adjust} />
      <Line x={xField} y={yField} color={color} adjust={adjust} />
      <Tooltip />
    </Chart>
  );
};

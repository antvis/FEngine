import { jsx } from '@antv/f-engine';
import { Chart, Axis, Point, Legend, Tooltip } from '@antv/f2';

export interface ScatterProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
  size?: object | string;
}

export default (props: ScatterProps) => {
  const { data, xField, yField, color, size } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Point x={xField} y={yField} size={size} color={color} />
      <Tooltip />
    </Chart>
  );
};

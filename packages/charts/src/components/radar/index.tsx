import { jsx } from '@antv/f-engine';
import { Chart, Axis, Line, Legend, Tooltip, Area, Point } from '@antv/f2';

export interface RadarProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
  showPoints?: boolean;
  showArea?: boolean;
}

export default (props: RadarProps) => {
  const { data, xField, yField, color, showPoints, showArea } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Line x={xField} y={yField} color={color} />
      {showArea && <Area x={xField} y={yField} color={color} />}
      {showPoints && <Point x={xField} y={yField} color={color} />}
      <Tooltip />
    </Chart>
  );
};

import { jsx } from '@antv/f-engine';
import { Chart, Axis, Interval, Legend, Tooltip } from '@antv/f2';

export interface FunnelProps {
  data: any;
  xField: string;
  yField: string;
  color?: string;
  labelCfg?: object;
}

export default (props: FunnelProps) => {
  const { data, xField, yField, color, labelCfg } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Axis field={xField} />
      <Axis field={yField} />
      <Interval
        x={xField}
        y={yField}
        adjust="symmetric"
        shape="funnel"
        color={color}
        showLabel
        labelCfg={{
          offsetX: 10,
          label: (data, color) => {
            return {
              text: data[yField],
              fill: color,
            };
          },
          ...labelCfg,
        }}
      />
      <Tooltip />
    </Chart>
  );
};

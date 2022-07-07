import { jsx } from '@antv/f-engine';
import { Chart, Axis, Interval, Legend, Tooltip, LegendProps, TooltipProps } from '@antv/f2';

export interface ColumnProps {
  // chart
  data: any;
  scale?: object;
  coord?: object;
  //Axis
  xField: string;
  yField: string;
  xTickCount?: number;
  yTickCount?: number;
  xAxisStyle?: object;
  yAxisStyle?: object;
  // componet
  color?: string | Array<string> | object;
  size?: string | Array<string> | object;
  animation?: object;
  adjust?: string;
  shape?: string;
  style?: object;
  //legend
  legend?: LegendProps;
  // tooltip
  tooltip?: TooltipProps;
  children?: JSX.Element;
}
export default (props: ColumnProps) => {
  const {
    data,
    scale,
    coord,
    xField,
    yField,
    xTickCount,
    xAxisStyle,
    yTickCount,
    yAxisStyle,
    color,
    size,
    animation,
    adjust,
    shape,
    legend,
    tooltip,
    children,
    style,
  } = props;

  return (
    <Chart data={data} coord={coord} scale={scale}>
      <Legend {...legend} />
      <Axis field={xField} tickCount={xTickCount} style={xAxisStyle} />
      <Axis field={yField} tickCount={yTickCount} style={yAxisStyle} />
      <Interval
        x={xField}
        y={yField}
        color={color}
        size={size}
        animation={animation}
        shape={shape}
        adjust={adjust}
        style={style}
      />
      {children}
      <Tooltip {...tooltip} />
    </Chart>
  );
};

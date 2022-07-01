import { jsx } from '@antv/f-engine';
import { Chart, Axis, Point, Legend, Tooltip, LegendProps, TooltipProps } from '@antv/f2';

export interface ScatterProps {
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
  shape?: string;
  style?: object;
  //legend
  legend?: LegendProps;
  // tooltip
  tooltip?: TooltipProps;
  children?: JSX.Element;
}

export default (props: ScatterProps) => {
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
    shape,
    legend,
    tooltip,
    children,
    style,
  } = props;
  return (
    <Chart data={data} scale={scale} coord={coord}>
      <Legend {...legend} />
      <Axis field={xField} tickCount={xTickCount} style={xAxisStyle} />
      <Axis field={yField} tickCount={yTickCount} style={yAxisStyle} />
      <Point
        x={xField}
        y={yField}
        size={size}
        color={color}
        animation={animation}
        shape={shape}
        style={style}
      />
      {children}
      <Tooltip {...tooltip} />
    </Chart>
  );
};

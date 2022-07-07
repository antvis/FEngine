import { jsx } from '@antv/f-engine';
import {
  Chart,
  Axis,
  Line,
  Legend,
  Tooltip,
  Area,
  Point,
  LegendProps,
  TooltipProps,
} from '@antv/f2';

export interface RadarProps {
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

  showPoints?: boolean;
  showArea?: boolean;
  children?: JSX.Element;
}

export default (props: RadarProps) => {
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
    showPoints,
    showArea,
    children,
    style,
  } = props;
  return (
    <Chart
      data={data}
      coord={{
        type: 'polar',
        ...coord,
      }}
      scale={scale}
    >
      <Legend {...legend} />
      <Axis field={xField} tickCount={xTickCount} style={xAxisStyle} />
      <Axis field={yField} tickCount={yTickCount} style={yAxisStyle} />
      <Line
        x={xField}
        y={yField}
        color={color}
        size={size}
        animation={animation}
        shape={shape}
        adjust={adjust}
      />
      {showArea && (
        <Area
          x={xField}
          y={yField}
          color={color}
          size={size}
          animation={animation}
          adjust={adjust}
        />
      )}
      {showPoints && (
        <Point
          x={xField}
          y={yField}
          color={color}
          size={size}
          animation={animation}
          adjust={adjust}
        />
      )}
      {children}
      <Tooltip {...tooltip} />
    </Chart>
  );
};

import { jsx } from '@antv/f-engine';
import { Chart, Interval, Legend, Tooltip, LegendProps, TooltipProps } from '@antv/f2';

export interface PieProps {
  // chart
  data: any;
  scale?: object;
  coord?: object;
  //Axis
  xField: string;
  yField: string;
  // componet
  color?: string | Array<string> | object;
  animation?: object;
  shape?: string;
  style?: object;
  //legend
  legend?: LegendProps;
  // tooltip
  tooltip?: TooltipProps;
  children?: JSX.Element;
}

export default (props: PieProps) => {
  const {
    data,
    scale,
    coord,
    xField,
    yField,
    color,
    animation,
    legend,
    tooltip,
    children,
    style,
  } = props;
  return (
    <Chart
      data={data}
      coord={{
        type: 'polar',
        transposed: true,
        ...coord,
      }}
      scale={{ scale }}
    >
      <Legend {...legend} />
      <Interval
        adjust="stack"
        x={xField}
        y={yField}
        color={color}
        animation={animation}
        style={style}
      />
      {children}
      <Tooltip {...tooltip} />
    </Chart>
  );
};

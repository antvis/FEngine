import { jsx } from '@antv/f-engine';
import { Chart, Interval, Legend, Tooltip, LegendProps, TooltipProps } from '@antv/f2';

export interface FunnelProps {
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
  labelCfg?: object;
  showLabel?: boolean;
  style?: object;
  //legend
  legend?: LegendProps;
  // tooltip
  tooltip?: TooltipProps;
  children?: JSX.Element;
}

export default (props: FunnelProps) => {
  const {
    data,
    scale,
    coord,
    xField,
    yField,
    color,
    animation,
    labelCfg,
    showLabel,
    legend,
    tooltip,
    children,
    style,
  } = props;

  return (
    <Chart
      data={data}
      scale={scale}
      coord={{
        transposed: true,
        ...coord,
      }}
    >
      <Legend {...legend} />
      <Interval
        x={xField}
        y={yField}
        adjust="symmetric"
        shape="funnel"
        color={color}
        showLabel={showLabel}
        labelCfg={labelCfg}
        animation={animation}
        style={style}
      />
      {children}
      <Tooltip {...tooltip} />
    </Chart>
  );
};

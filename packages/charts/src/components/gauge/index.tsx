import { jsx } from '@antv/f-engine';
import { Gauge } from '@antv/f2';

export interface GaugeProps {
  center: { x: number; y: number };
  startAngle: number | string;
  endAngle: number | string;
  percent?: number | string;
  r: number | string;
  tickCount: number;
  tickOffset: string;
  tickLength: string;
}

export default (props: GaugeProps) => {
  const { center, startAngle, endAngle, percent, r, tickCount, tickOffset, tickLength } = props;
  return (
    <Gauge
      center={center}
      startAngle={startAngle}
      endAngle={endAngle}
      percent={percent}
      r={r}
      tickCount={tickCount}
      tickOffset={tickOffset}
      tickLength={tickLength}
    />
  );
};

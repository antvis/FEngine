import { jsx } from '@antv/f-engine';
import { Chart, Sunburst, Legend, Tooltip } from '@antv/f2';

export interface SunburstProps {
  data: any;
  yField: string;
  color?: string;
}

export default (props: SunburstProps) => {
  const { data, yField, color } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Sunburst
        data={data}
        coord={{
          type: 'polar',
        }}
        color={color}
        value={yField}
        space={4}
      />
      <Tooltip />
    </Chart>
  );
};

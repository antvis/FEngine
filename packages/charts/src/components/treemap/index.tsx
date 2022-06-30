import { jsx } from '@antv/f-engine';
import { Chart, Treemap, Legend, Tooltip } from '@antv/f2';

export interface TreemapProps {
  data: any;
  yField: string;
  color?: string;
}

export default (props: TreemapProps) => {
  const { data, yField, color } = props;
  return (
    <Chart data={data}>
      <Legend />
      <Treemap
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

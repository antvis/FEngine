import { jsx } from '@antv/f-engine';
import { Treemap } from '@antv/f2';

export interface TreemapProps {
  // chart
  data: any;
  coord?: object;
  //Axis
  yField: string;
  // componet
  color?: string | Array<string> | object;
  size?: string | Array<string> | object;
  animation?: object;
  space?: number;
}

export default (props: TreemapProps) => {
  const { data, yField, color, space, animation } = props;
  return <Treemap data={data} color={color} value={yField} space={space} animation={animation} />;
};

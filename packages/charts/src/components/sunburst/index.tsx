import { jsx } from '@antv/f-engine';
import { Sunburst } from '@antv/f2';

export interface SunburstProps {
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

export default (props: SunburstProps) => {
  const { data, yField, color, coord, animation, space } = props;
  return (
    <Sunburst
      data={data}
      coord={coord}
      color={color}
      value={yField}
      space={space}
      animation={animation}
    />
  );
};

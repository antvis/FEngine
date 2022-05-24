import type { DisplayObjectConfig } from '@antv/g';
import { CustomElement, Path } from '@antv/g';
import { deepMix } from '@antv/util';
import { arcToPath } from './util';
import { ArcStyleProps } from './types';

const defaultStyle = {
  x: 0,
  y: 0,
  r: 0,
  startAngle: 0,
  endAngle: Math.PI * 2,
  anticlockwise: false,
  lineWidth: 1,
}
export class Arc extends CustomElement<ArcStyleProps> {
  static tag = 'arc';
  constructor(config: DisplayObjectConfig<ArcStyleProps>) {

    const style = deepMix({}, defaultStyle, config.style)

    super({
      style,
      type: Arc.tag,
    });

    const { x, y, r, startAngle, endAngle, anticlockwise, stroke, lineWidth, opacity, strokeOpacity, fill, fillOpacity } = this.attributes;

    if (startAngle !== endAngle) {
      const path =  new Path({
        style: {
          opacity, 
          strokeOpacity,
          stroke,
          lineWidth,
          fill,
          fillOpacity,
          path: arcToPath( x, y, r, startAngle, endAngle, anticlockwise).join(" ")
        },
      });
      this.appendChild(path);
    }
  }
}

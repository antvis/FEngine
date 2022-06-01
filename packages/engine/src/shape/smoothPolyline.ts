import { Polyline, Path, CustomElement } from '@antv/g';
import type { DisplayObjectConfig, DisplayObject } from '@antv/g';
import { deepMix } from '@antv/util';
import * as Smooth from './util/smooth';
import { SmoothPolylineStyleProps } from './types'

const defaultStyle = {
  shape: 'line' 
}

export class SmoothPolyline extends CustomElement<SmoothPolylineStyleProps> {
  static tag = 'smooth-polyline';
  private shape: DisplayObject;

  constructor(config: DisplayObjectConfig<SmoothPolylineStyleProps>) {

    const style = deepMix({}, defaultStyle, config.style)
    const { smooth, ...other } = style

    const { points } = style
    super({
      style,
      type: SmoothPolyline.tag,
    });

    if(smooth) {
     
      const d = [
        ['M', points[0][0], points[0][1]]
      ]
      const constaint = [
        [0, 0],
        [1, 1],
      ];
      const sps = Smooth.smooth(points.map( d => {
        return {
          x: d[0],
          y: d[1]
        }
      }), false, constaint);

      for (let i = 0, n = sps.length; i < n; i++) {
        const sp = sps[i];
        d.push(['C',sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]]);
      }

      const path = new Path({
        style: {
          ...other,
          path: d.join(" ")
        }
      })
      this.shape = path
      this.appendChild(path);
    } else {
      const polyline =  new Polyline({
        style: other,
      });
      this.shape = polyline
      this.appendChild(polyline);
    }
  }

  getShape() {
    return this.shape
  }
}

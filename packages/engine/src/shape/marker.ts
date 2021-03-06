import type { DisplayObjectConfig } from '@antv/g';
import { CustomElement, Path } from '@antv/g';
import { deepMix, PathArray } from '@antv/util'
import { MarkerStyleProps } from './types'

const defaultStyle = {
    x: 0,
    y: 0,
    lineWidth: 1,
    symbol: 'circle'
}

const SYMBOLS = {
  circle(x, y, r): PathArray {
    return [
      ['M', x - r, y],
      ['A', r, r, 0, 1, 0, x + r, y],
      ['A', r, r, 0, 1, 0, x - r, y],
    ];
  },

  square(x, y, r): PathArray {
    return [
      ['M', x - r, y - r],
      ['L', x + r, y - r],
      ['L', x + r, y + r],
      ['L', x - r, y + r],
      ['Z'],
    ];
  },
};

export class Marker extends CustomElement<MarkerStyleProps> {
    static tag = 'marker';
    private path: Path;

    constructor(config: DisplayObjectConfig<MarkerStyleProps>) {
  
      const style = deepMix({}, defaultStyle, config.style)
  
      super({
        style,
        type: Marker.tag,
      });

      const { radius, symbol, stroke, lineWidth, opacity, strokeOpacity, fill, fillOpacity } = this.attributes;
      const method = SYMBOLS[symbol]

        const path =  new Path({
          style: {
            opacity, 
            strokeOpacity,
            stroke,
            lineWidth,
            fill,
            fillOpacity,
            path: method( 0, 0, radius)
          },
        });
        this.appendChild(path);
    }

    getShape() {
      return this.path
    }
}
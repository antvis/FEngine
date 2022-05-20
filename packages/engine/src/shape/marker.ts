import type { DisplayObjectConfig } from '@antv/g';
import { CustomElement, Path } from '@antv/g';
import { deepMix } from '@antv/util'
import { MarkerStyleProps } from './types'

const defaultStyle = {
    x: 0,
    y: 0,
    lineWidth: 1,
    symbol: 'circle'
}

const SYMBOLS = {
  circle(x, y, r) {
    return [
      ['M', x - r, y],
      ['A', r, r, 0, 1, 0, x + r, y],
      ['A', r, r, 0, 1, 0, x - r, y],
    ].join(" ");
  },

  square(x, y, r) {
    return [
      ['M', x - r, y - r],
      ['L', x + r, y - r],
      ['L', x + r, y + r],
      ['L', x - r, y + r],
      ['Z'],
    ].join(" ");
  },
};

export class Marker extends CustomElement<MarkerStyleProps> {
    static tag = 'marker';
    constructor(config: DisplayObjectConfig<MarkerStyleProps>) {
  
      const style = deepMix({}, defaultStyle, config.style)
  
      super({
        style,
        type: Marker.tag,
      });

      const { x, y, radius, symbol, stroke, lineWidth, opacity, strokeOpacity, fill, fillOpacity } = this.attributes;
      const method = SYMBOLS[symbol]

        const path =  new Path({
          style: {
            opacity, 
            strokeOpacity,
            stroke,
            lineWidth,
            fill,
            fillOpacity,
            path: method( x, y, radius)
          },
        });
        this.appendChild(path);
    }
}
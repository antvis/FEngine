import { DisplayObjectConfig, BaseStyleProps } from '@antv/g-lite';
import { Path } from '@antv/g-lite';
import { PathArray } from '@antv/util';

export interface MarkerStyleProps extends BaseStyleProps {
  x?: string | number;
  y?: string | number;
  symbol?: 'circle' | 'square' | 'arrow';
  radius?: string | number;
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

  arrow(x, y, r): PathArray {
    return [
      ['M', x - r, y + (2 * r) / Math.sqrt(3)],
      ['L', x + r, y + (2 * r) / Math.sqrt(3)],
      ['L', x, y - (2 * r) / Math.sqrt(3)],
      ['Z'],
    ];
  },
};

export class Marker extends Path {
  parsedStyle: any;

  constructor(config: DisplayObjectConfig<MarkerStyleProps>) {
    super(config);
    this.updatePath();
  }

  setAttribute(name, value, force?: boolean) {
    super.setAttribute(name, value, force);
    if (['x', 'y', 'symbol', 'radius'].indexOf(name) > -1) {
      this.updatePath();
    }
  }

  updatePath() {
    const { x = 0, y = 0 } = this.parsedStyle;
    const { radius, symbol } = this.attributes as MarkerStyleProps;
    if (!symbol) return;
    const method = SYMBOLS[symbol];
    if (!method) return;

    const path = method(x, y, radius);

    super.setAttribute('path', path);
  }
}

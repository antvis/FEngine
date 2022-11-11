import { DisplayObjectConfig, BaseStyleProps } from '@antv/g-lite';
import { CustomElement, Path } from '@antv/g-lite';
import { deepMix, PathArray } from '@antv/util';

export interface MarkerStyleProps extends BaseStyleProps {
  x?: string | number;
  y?: string | number;
  symbol?: 'circle' | 'square';
  radius?:
    | string
    | number
    | [string | number]
    | [string | number, string | number]
    | [string | number, string | number, string | number]
    | [string | number, string | number, string | number, string | number];
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
    const { radius = [0, 0, 0, 0], symbol = 'circle', x = 0, y = 0 } = this.parsedStyle;
    const method = SYMBOLS[symbol];

    // radius 表示半径，内部自动格式化成了[]
    const path = method(x, y, radius[0]);

    super.setAttribute('path', path);
  }
}

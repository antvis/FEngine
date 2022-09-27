import { Path, deg2rad } from '@antv/g-lite';
import { isNumberEqual, PathArray } from '@antv/util';
import { polarToCartesian } from './util/util';

export class Arc extends Path {
  parsedStyle: any;
  constructor(config) {
    super(config);
    this.updatePath();
  }
  setAttribute(name, value, force?: boolean) {
    super.setAttribute(name, value, force);
    if (['startAngle', 'endAngle', 'r'].indexOf(name) > -1) {
      this.updatePath();
    }
  }

  private updatePath() {
    const { x, y, startAngle, endAngle, r, anticlockwise } = this.parsedStyle;

    const path = this.createPath(
      x,
      y,
      startAngle ? deg2rad(startAngle) : 0,
      endAngle ? deg2rad(endAngle) : Math.PI * 2,
      r ? r : 0,
      anticlockwise
    );
    super.setAttribute('path', path);
  }

  private createPath(
    x: number,
    y: number,
    startAngle: number,
    endAngle: number,
    r: number,
    anticlockwise: boolean
  ): PathArray {
    if (endAngle < startAngle) {
      endAngle = endAngle + Math.PI * 2;
    }
    if (r <= 0) {
      return null;
    }

    const start = polarToCartesian(x, y, r, startAngle);
    const end = polarToCartesian(x, y, r, endAngle);

    if (isNumberEqual(endAngle - startAngle, Math.PI * 2)) {
      const middlePoint = polarToCartesian(x, y, r, startAngle + Math.PI);
      return [
        ['M', start.x, start.y],
        ['A', r, r, 0, 1, 1, middlePoint.x, middlePoint.y],
        ['A', r, r, 0, 1, 1, start.x, start.y],
        ['A', r, r, 0, 1, 0, middlePoint.x, middlePoint.y],
        ['A', r, r, 0, 1, 0, start.x, start.y],
        ['Z'],
      ];
    }
    const arcSweep = endAngle - startAngle <= Math.PI ? 0 : 1;
    return [
      ['M', start.x, start.y],
      ['A', r, r, 0, arcSweep, anticlockwise ? 0 : 1, end.x, end.y],
    ];
  }
}

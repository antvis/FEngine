import { Path, deg2rad, PathCommand } from '@antv/g';
import { isNumberEqual } from '@antv/util';
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
    const { x, y, startAngle, endAngle, r } = this.parsedStyle;

    const path = this.createPath(
      x.value,
      y.value,
      deg2rad(startAngle.value),
      deg2rad(endAngle.value),
      r.value
    );
    super.setAttribute('path', path);
  }

  private createPath(
    centerX: number,
    centerY: number,
    startAngleInRadian: number,
    endAngleInRadian: number,
    radius: number
  ): PathCommand[] {
    const start = polarToCartesian(centerX, centerY, radius, startAngleInRadian);
    const end = polarToCartesian(centerX, centerY, radius, endAngleInRadian);

    if (isNumberEqual(endAngleInRadian - startAngleInRadian, Math.PI * 2)) {
      const middlePoint = polarToCartesian(centerX, centerY, radius, startAngleInRadian + Math.PI);
      return [
        ['M', start.x, start.y],
        ['A', radius, radius, 0, 1, 1, middlePoint.x, middlePoint.y],
        ['A', radius, radius, 0, 1, 1, start.x, start.y],
        ['A', radius, radius, 0, 1, 0, middlePoint.x, middlePoint.y],
        ['A', radius, radius, 0, 1, 0, start.x, start.y],
        ['Z'],
      ];
    }
    const arcSweep = endAngleInRadian - startAngleInRadian <= Math.PI ? 0 : 1;
    return [
      ['M', start.x, start.y],
      ['A', radius, radius, 0, arcSweep, 1, end.x, end.y],
    ];
  }
}

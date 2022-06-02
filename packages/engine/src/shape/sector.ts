import { Path, deg2rad, PathCommand } from '@antv/g';
import { polarToCartesian } from './util/util';

export class Sector extends Path {
  parsedStyle: any;
  constructor(config) {
    super(config);
    this.updatePath();
  }
  setAttribute(name, value, force?: boolean) {
    super.setAttribute(name, value, force);
    if (['startAngle', 'endAngle', 'r', 'r0'].indexOf(name) > -1) {
      this.updatePath();
    }
  }

  private updatePath() {
    const { x, y, startAngle, endAngle, r, r0 } = this.parsedStyle;

    const path = this.createPath(
      x.value,
      y.value,
      deg2rad(startAngle.value),
      deg2rad(endAngle.value),
      r.value,
      r0.value
    );
    super.setAttribute('path', path);
  }

  private createPath(
    centerX: number,
    centerY: number,
    startAngleInRadian: number,
    endAngleInRadian: number,
    radius: number,
    innerRadius: number
  ): PathCommand[] {
    const start = polarToCartesian(centerX, centerY, radius, startAngleInRadian);
    const end = polarToCartesian(centerX, centerY, radius, endAngleInRadian);

    const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngleInRadian);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngleInRadian);

    if (endAngleInRadian - startAngleInRadian === Math.PI * 2) {
      // 整个圆是分割成两个圆
      const middlePoint = polarToCartesian(centerX, centerY, radius, startAngleInRadian + Math.PI);
      const innerMiddlePoint = polarToCartesian(
        centerX,
        centerY,
        innerRadius,
        startAngleInRadian + Math.PI
      );
      const circlePathCommands = [
        ['M', start.x, start.y],
        ['A', radius, radius, 0, 1, 1, middlePoint.x, middlePoint.y],
        ['A', radius, radius, 0, 1, 1, end.x, end.y],
        ['M', innerStart.x, innerStart.y],
      ];
      if (innerRadius) {
        circlePathCommands.push([
          'A',
          innerRadius,
          innerRadius,
          0,
          1,
          0,
          innerMiddlePoint.x,
          innerMiddlePoint.y,
        ]);
        circlePathCommands.push(['A', innerRadius, innerRadius, 0, 1, 0, innerEnd.x, innerEnd.y]);
      }

      circlePathCommands.push(['M', start.x, start.y]);
      circlePathCommands.push(['Z']);

      return circlePathCommands as PathCommand[];
    }

    const arcSweep = endAngleInRadian - startAngleInRadian <= Math.PI ? 0 : 1;
    const sectorPathCommands = [
      ['M', start.x, start.y],
      ['A', radius, radius, 0, arcSweep, 1, end.x, end.y],
      ['L', innerEnd.x, innerEnd.y],
    ];
    if (innerRadius) {
      sectorPathCommands.push([
        'A',
        innerRadius,
        innerRadius,
        0,
        arcSweep,
        0,
        innerStart.x,
        innerStart.y,
      ]);
    }
    sectorPathCommands.push(['L', start.x, start.y]);
    sectorPathCommands.push(['Z']);

    return sectorPathCommands as PathCommand[];
  }
}

import { Path, deg2rad, BaseStyleProps } from '@antv/g-lite';
import { isNumberEqual, PathArray, isNil } from '@antv/util';
import { polarToCartesian } from './util/util';

export interface ArcStyleProps extends BaseStyleProps {
  /**
   * @title 起始角度/弧度
   */
  startAngle: string | number;
  /**
   * @title 结束角度/弧度
   */
  endAngle: string | number;
  /**
   * @title 半径
   */
  r: string | number;
  /**
   * @title 圆心 x 坐标
   */
  cx?: string | number;
  /**
   * @title 圆心 y 坐标
   */
  cy?: string | number;
  /**
   * @title 逆时针绘制
   */
  anticlockwise?: boolean;
}

function computeArcSweep(startAngle: number, endAngle: number, anticlockwise: boolean) {
  // 顺时针方向
  if (!anticlockwise) {
    if (endAngle >= startAngle) {
      return endAngle - startAngle <= Math.PI ? 0 : 1;
    }
    return endAngle - startAngle <= -Math.PI ? 0 : 1;
  }

  // 逆时针方向
  if (endAngle >= startAngle) {
    return endAngle - startAngle <= Math.PI ? 1 : 0;
  }
  return endAngle - startAngle <= -Math.PI ? 1 : 0;
}

export class Arc extends Path {
  parsedStyle: any;
  constructor(config) {
    super(config);
    this.updatePath();
  }
  setAttribute(name, value, force?: boolean) {
    super.setAttribute(name, value, force);
    if (['cx', 'cy', 'startAngle', 'endAngle', 'r', 'anticlockwise'].indexOf(name) > -1) {
      this.updatePath();
    }
  }

  private updatePath() {
    const { cx = 0, cy = 0, startAngle, endAngle, r, anticlockwise } = this.parsedStyle;

    if (isNil(startAngle) || isNil(endAngle) || startAngle === endAngle || isNil(r) || r <= 0) {
      super.setAttribute('path', '');
      return;
    }

    const path = this.createPath(cx, cy, deg2rad(startAngle), deg2rad(endAngle), r, anticlockwise);
    super.setAttribute('path', path);
  }

  private createPath(
    x: number,
    y: number,
    startAngle: number,
    endAngle: number,
    r: number,
    anticlockwise: boolean,
  ): PathArray {
    const start = polarToCartesian(x, y, r, startAngle);
    const end = polarToCartesian(x, y, r, endAngle);

    const angle = Math.abs(endAngle - startAngle);

    if (angle >= Math.PI * 2 || isNumberEqual(angle, Math.PI * 2)) {
      const middlePoint = polarToCartesian(x, y, r, startAngle + Math.PI);
      return [
        ['M', start.x, start.y],
        ['A', r, r, 0, 1, anticlockwise ? 0 : 1, middlePoint.x, middlePoint.y],
        ['A', r, r, 0, 1, anticlockwise ? 0 : 1, start.x, start.y],
        ['Z'],
      ];
    }
    const arcSweep = computeArcSweep(startAngle, endAngle, anticlockwise);
    return [
      ['M', start.x, start.y],
      ['A', r, r, 0, arcSweep, anticlockwise ? 0 : 1, end.x, end.y],
    ];
  }
}

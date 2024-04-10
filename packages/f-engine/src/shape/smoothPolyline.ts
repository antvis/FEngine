import { Path } from '@antv/g-lite';
import { PathArray } from '@antv/util';
import * as Smooth from './util/smooth';


export class SmoothPolyline extends Path {
  static tag = 'smooth-polyline';
  parsedStyle: any;

  constructor(config) {
    super(config);
    this.updatePath();
  }

  setAttribute(name, value, force?: boolean) {
    super.setAttribute(name, value, force);
    if (['smooth', 'points', 'step'].indexOf(name) > -1) {
      this.updatePath();
    }
  }

  private updatePath() {
    const { smooth, points, step } = this.parsedStyle;
    const { points: pos } = points;

    const d: PathArray = [['M', pos[0][0], pos[0][1]]];

    if (smooth) {
      const constaint = [
        [0, 0],
        [1, 1],
      ];
      const sps = Smooth.smooth(
        pos.map((d) => {
          return {
            x: d[0],
            y: d[1],
          };
        }),
        false,
        constaint
      );

      for (let i = 0, n = sps.length; i < n; i++) {
        const sp = sps[i];
        d.push(['C', sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]]);
      }
    } else if (step) {
      let i;
      let l;
      switch (step) {
        case "start":
          for (i = 1, l = pos.length; i < l; i++) {
            const x = pos[i - 1][0]
            d.push(['L', x, pos[i - 1][1]])
            d.push(['L', x, pos[i][1]])
            d.push(['L', pos[i][0], pos[i][1]]);
          }
          break;
        case "middle":
          for (i = 1, l = pos.length; i < l; i++) {
            const x = (pos[i][0] + pos[i - 1][0]) / 2
            d.push(['L', x, pos[i - 1][1]])
            d.push(['L', x, pos[i][1]])
            d.push(['L', pos[i][0], pos[i][1]]);
          }
          break;
        case "end":
          for (i = 1, l = pos.length; i < l; i++) {
            const x = pos[i][0]
            d.push(['L', x, pos[i - 1][1]])
            d.push(['L', x, pos[i][1]])
            d.push(['L', pos[i][0], pos[i][1]]);
          }
          break;
      }
    } else {
      let i;
      let l;
      for (i = 1, l = pos.length - 1; i < l; i++) {
        d.push(['L', pos[i][0], pos[i][1]]);
      }
      d.push(['L', pos[l][0], pos[l][1]]);
    }
    super.setAttribute('path', d);
  }
}

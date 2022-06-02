import type { DisplayObjectConfig } from '@antv/g';
import { CustomElement, Path, DisplayObject, isNil } from '@antv/g';
import { deepMix } from '@antv/util';
import { arcToPath, cssRegister, getRadAngle, clearWapperStyle } from './util/util';
import { ArcStyleProps, ArcToPathProps } from './types';

const defaultStyle = {
  x: 0,
  y: 0,
  r: 0,
  startAngle: '0rad',
  endAngle: `${Math.PI * 2}rad`,
  anticlockwise: false,
  lineWidth: 1,
}
export class Arc extends CustomElement<ArcStyleProps> {
  static tag = 'arc';
  private path: Path;
  private oldProps: ArcToPathProps;

  constructor(config: DisplayObjectConfig<ArcStyleProps>) {

    const style = deepMix({}, defaultStyle, config.style)
   
    super({
      style,
      type: Arc.tag,
    });

    const { x, y, r, startAngle, endAngle, anticlockwise, stroke, lineWidth, opacity, strokeOpacity, fill, fillOpacity } = this.attributes;
    cssRegister(['startAngle', 'endAngle']);
    clearWapperStyle(this);

    const startRadAngle = getRadAngle(startAngle);
    const endRadAngle = getRadAngle(endAngle);

    if (startAngle !== endAngle && r!== 0) {
      const path =  new Path({
        style: {
          opacity, 
          strokeOpacity,
          stroke,
          lineWidth,
          fill,
          fillOpacity,
          path: arcToPath( x, y, r, startRadAngle, endRadAngle, anticlockwise).join(" ")
        },
      });
      this.path = path;
      this.oldProps = {
        r,
        startRadAngle,
        endRadAngle,
        anticlockwise,
      };
      this.appendChild(path);
    }
  }


  getShape() {
    return this.path
  }

  attributeChangedCallback<Key extends keyof ArcStyleProps>(
    name: Key,
    oldValue: ArcStyleProps[Key],
    newValue: ArcStyleProps[Key]
  ) {
    this.applySectorStyle({ [name]: newValue }, this.path);
  }

  applySectorStyle(attributes: ArcStyleProps, shape: DisplayObject) {
    const {
      opacity,
      fillOpacity,
      fill,
      stroke,
      strokeOpacity,
      lineWidth,
      startAngle,
      endAngle,
    } = attributes;

    if (!isNil(opacity)) {
      shape.style.opacity = opacity;
    }

    if (!isNil(fill)) {
      shape.style.stroke = fill;
    }

    if (!isNil(stroke)) {
      shape.style.stroke = stroke;
    }

    if (!isNil(strokeOpacity)) {
      shape.style.strokeOpacity = strokeOpacity;
    }

    if (!isNil(fillOpacity)) {
      shape.style.fillOpacity = fillOpacity;
    }

    if (!isNil(lineWidth)) {
      shape.style.lineWidth = lineWidth;
    }

    if (!isNil(endAngle)) {
      const { x, y, startRadAngle, r, anticlockwise } = this.oldProps;
      shape.style.path = arcToPath(
        x, y, r, startRadAngle, anticlockwise ? -getRadAngle(endAngle) : getRadAngle(endAngle), anticlockwise
      ).join(" ");
    }

    if (!isNil(startAngle)) {
      const { endRadAngle, r, anticlockwise } = this.oldProps;
      shape.style.path = arcToPath(
        x, y, r, getRadAngle(startAngle), endRadAngle, anticlockwise
      ).join(" ");
    }
  }

}

import type { DisplayObjectConfig } from '@antv/g';
import { CustomElement, Path, DisplayObject, isNil } from '@antv/g';
import { deepMix } from '@antv/util'
import { SectorStyleProps } from './types'
import { arc, polarToCartesian } from './util/util'

const defaultStyle = {
    x: 0,
    y: 0,
    lineWidth: 0,
    r: 0,
    r0: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    anticlockwise: false,
}

export class Sector extends CustomElement<SectorStyleProps> {
    static tag = 'marker';
    private path: Path;

    constructor(config: DisplayObjectConfig<SectorStyleProps>) {
  
      const style = deepMix({}, defaultStyle, config.style)
  
      super({
        style,
        type: Sector.tag,
      });

      const { x, y, startAngle, endAngle, r, r0, anticlockwise, stroke, lineWidth, opacity, strokeOpacity, fill, fillOpacity } = this.attributes;
      this.cssRegister([startAngle]);

        const path =  new Path({
          style: {
            opacity, 
            strokeOpacity,
            stroke,
            lineWidth,
            fill,
            fillOpacity,
            path: this.createPath(x, y, startAngle, Math.min(endAngle, startAngle + Math.PI * 2), r, r0, anticlockwise)
          },
        });
        this.path = path
        this.appendChild(path);
    }

    private createPath(x, y, startAngle, endAngle, r, r0, anticlockwise){
        const d = []
        const unitX = Math.cos(startAngle);
        const unitY = Math.sin(startAngle);

        d.push(["M", unitX * r0 + x, unitY * r0 + y])

        d.push(["L", unitX * r + x, unitY * r + y])

      // 当扇形的角度非常小的时候，就不进行弧线的绘制；或者整个只有1个扇形时，会出现end<0的情况不绘制
    if (Math.abs(endAngle - startAngle) > 0.0001 || (startAngle === 0 && endAngle < 0)) {
      
        d.push(arc(x, y, r, startAngle, endAngle, !anticlockwise, true))


        d.push(["L", Math.cos(endAngle) * r0 + x, Math.sin(endAngle) * r0 + y])

        if (r0 !== 0) {
            d.push(arc(x, y, r0, startAngle, endAngle, anticlockwise))
        }
      }
        return d.join(" ")
    }

    attributeChangedCallback<Key extends keyof SectorStyleProps>(
      name: Key,
      oldValue: SectorStyleProps[Key],
      newValue: SectorStyleProps[Key],
    ) {
        this.applySectorStyle({ [name]: newValue }, this.path)
    } 
    
    applySectorStyle(attributes: SectorStyleProps, shape: DisplayObject) {
      const { opacity, fillOpacity, fill, stroke, strokeOpacity, lineWidth } = attributes;
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
    }

    cssRegister(objects) {
      // objects.forEach((name) => CSS.registerProperty({
      //   name,
      //   inherits: false,
      //   initialValue: '0',
      //   interpolable: true,
      //   syntax: PropertySyntax.LENGTH_PERCENTAGE,
      // }));
    }
}


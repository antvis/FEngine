import { CSS, PropertySyntax } from '@antv/g-lite';

// 注册 css 属性，不能注册已有属性，比如 r width等
const SECTOR_CSS_PROPERTY = [
  {
    name: 'r0',
    inherits: false,
    interpolable: true,
    syntax: PropertySyntax.LENGTH_PERCENTAGE,
  },
  {
    name: 'startAngle',
    inherits: false,
    interpolable: true,
    syntax: PropertySyntax.ANGLE,
  },
  {
    name: 'endAngle',
    inherits: false,
    interpolable: true,
    syntax: PropertySyntax.ANGLE,
  },
];
SECTOR_CSS_PROPERTY.forEach((property) => {
  CSS.registerProperty(property);
});

export * from './arc';
export * from './marker';
export * from './sector';
export * from './smoothPolyline';

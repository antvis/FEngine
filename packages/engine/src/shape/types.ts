import type { BaseStyleProps } from '@antv/g';

export interface ArcStyleProps extends BaseStyleProps {
    x?: number;
    y?: number;
    r: number;
    startAngle: number;
    endAngle: number;
    anticlockwise?: boolean;
}

export interface MarkerStyleProps extends BaseStyleProps {
    x: number;
    y: number;
    radius: number;
    symbol:
      | 'circle'
      | 'square'
}

export interface SectorStyleProps extends BaseStyleProps {
    x?: number;
    y?: number;
    startAngle: number;
    endAngle: number;
    r: number;
    r0: number;
    anticlockwise?: boolean;
}
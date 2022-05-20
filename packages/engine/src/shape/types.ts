import type { BaseStyleProps } from '@antv/g';

export interface ArcStyleProps extends BaseStyleProps {
    x?: number;
    y?: number;
    r: number;
    startAngle: number;
    endAngle: number;
    anticlockwise?: boolean;
}
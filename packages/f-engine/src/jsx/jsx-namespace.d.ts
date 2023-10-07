import { Ref, ElementType, IProps } from '../types/jsx';
import {
  GroupShapeProps,
  RectShapeProps,
  CircleShapeProps,
  LineShapeProps,
  PolygonShapeProps,
  PolylineShapeProps,
  ArcShapeProps,
  SectorShapeProps,
  TextShapeProps,
  MarkerShapeProps,
  ImageShapeProps,
  PathShapeProps,
} from '../types/shape';

export namespace JSX {
  export interface Element {
    key: string | null;
    ref?: Ref;
    type: ElementType;
    props: IProps;
    [key: string]: any;
  }

  export interface ElementClass {
    props: IProps;
    render(): Element | null | Promise<void>;
  }

  export interface ElementAttributesProperty {
    props: IProps;
  }

  export interface IntrinsicAttributes {
    key?: number | string;
    ref?: Ref;
    animate?: boolean;
    transformFrom?: any;
    children?: any;
  }

  export interface IntrinsicClassAttributes {
    key?: number | string;
    ref?: Ref;
    animate?: boolean;
    transformFrom?: any;
    children?: any;
  }

  export interface ElementChildrenAttribute {
    children: {};
  }

  export interface IntrinsicElements {
    group: GroupShapeProps;
    rect: RectShapeProps;
    circle: CircleShapeProps;
    line: LineShapeProps;
    polygon: PolygonShapeProps;
    polyline: PolylineShapeProps;
    arc: ArcShapeProps;
    sector: SectorShapeProps;
    text: TextShapeProps;
    marker: MarkerShapeProps;
    image: ImageShapeProps;
    path: PathShapeProps;
    [key: string]: any;
  }
}

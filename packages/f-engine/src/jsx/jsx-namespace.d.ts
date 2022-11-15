import {
  Ref,
  ElementType,
  IProps,
  GroupProps,
  RectProps,
  CircleProps,
  LineProps,
  PolygonProps,
  PolylineProps,
  ArcProps,
  SectorProps,
  TextProps,
  MarkerProps,
  ImageProps,
  PathProps,
} from '../types/jsx';

export namespace JSX {
  export interface Element {
    key?: number | string | null;
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
  }

  export interface IntrinsicClassAttributes {
    key?: number | string;
    ref?: Ref;
  }

  export interface IntrinsicElements {
    group: GroupProps;
    rect: RectProps;
    circle: CircleProps;
    line: LineProps;
    polygon: PolygonProps;
    polyline: PolylineProps;
    arc: ArcProps;
    sector: SectorProps;
    text: TextProps;
    marker: MarkerProps;
    image: ImageProps;
    path: PathProps;
    [key: string]: any;
  }
}

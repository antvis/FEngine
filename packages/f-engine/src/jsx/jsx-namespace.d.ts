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
    key: string;
    ref?: Ref;
    type: ElementType;
    props: IProps;
    [key: string]: any;
  }

  export interface ElementClass {
    props: IProps;
    render(): Element | null | Promise<void>;
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

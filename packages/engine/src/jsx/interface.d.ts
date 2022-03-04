import { Ref, ElementType, Props } from '../types';

declare global {
  namespace JSX {
    interface Element {
      key: string;
      ref?: Ref;
      type: ElementType;
      props: Props;
      // children: Element;
      _cache?: any;
      [key: string]: any;
    }
    interface ElementClass {
      refs: {};
      props: Props;
      render(): Element | null;
    }
    interface IntrinsicElements {
      group: any;
      rect: any;
      circle: any;
      line: any;
      polygon: any;
      polyline: any;
      arc: any;
      sector: any;
      text: any;
      custom: any;
      marker: any;
      image: any;

      // group: RectProps;
      // rect: RectProps;
      // circle: CircleProps;
      // line: LineProps;
      // polygon: PolygonProps;
      // polyline: PolylineProps;
      // arc: ArcProps;
      // sector: SectorProps;
      // text: TextProps;
      // custom: CustomProps;
      // marker: MarkerProps;
      // image: ImageProps;
    }
  }
}

export default JSX;

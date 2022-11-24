import { JSX } from '../jsx/jsx-namespace';
import Component from '../component';

export interface Ref<T = any> {
  current?: T;
}

export interface IProps {
  [key: string]: any;
}

export interface IState {
  [key: string]: any;
}

export interface IContext {
  [key: string]: any;
}

export type ElementType =
  | string
  | ((props: IProps, context?: IContext) => JSX.Element | null)
  | (new (props: IProps, context?: IContext) => Component<any, any>);

export interface FunctionComponent<P = IProps> {
  (props: P, context?: any): JSX.Element | null;
}

export interface ComponentClass<P = IProps, S = IState> {
  new (props: P, context?: any): Component<P, S>;
}

export type ComponentType<P = IProps> = ComponentClass<P> | FunctionComponent<P>;

export type ClassComponent<P = {}, S = {}> = ComponentClass<P, S>;
export type FC<P = {}> = FunctionComponent<P>;
export type HOC<T extends ClassComponent<P, S>, P = {}, S = {}> = FC<P> & T;

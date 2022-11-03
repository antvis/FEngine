export * from './shape';
import { JSX } from '../jsx/jsx-namespace';

export interface IProps {
  [key: string]: any;
}

export interface IState {
  [key: string]: any;
}

export interface IContext {
  [key: string]: any;
}

export interface Ref<T> {
  current?: T;
}

export type ElementType =
  | string
  | ((props: IProps, context?: IContext) => JSX.Element | null)
  | (new (props: IProps, context?: IContext) => JSX.Element | null);

export interface FunctionComponent<P = {}> {
  (props: P, context?: any): JSX.Element | null;
}

export type FC<P = {}> = FunctionComponent<P>;

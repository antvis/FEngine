import { JSX } from './jsx/jsx-namespace';
import { FunctionComponent } from './types';

export interface ReactContext<T> {
  Provider: FunctionComponent<{ value: T; children: JSX.Element }>;
  Injecter: FunctionComponent<{ children: JSX.Element; [key: string]: any }>;
  Consumer: FunctionComponent<{ children: (value: T) => JSX.Element | null }>;
}

export default function createContext<T>(defaultValue?: T) {
  // 创建 Context 对象
  const context = {
    _currentValue: defaultValue,
  } as any;

  // 定义 Provider 组件
  const Provider = function Provider({ value, children }) {
    context._currentValue = value;
    return children;
  };

  // Injecter 可以往全局的 context 注入内容
  const Injecter = function Injecter({ children, ...props }, context) {
    Object.assign(context, props);
    return children;
  };
  Injecter.contextInjecter = context;

  // 定义 Consumer 组件
  const Consumer = function Consumer({ children }) {
    return children(context._currentValue);
  };

  context.Provider = Provider;
  context.Injecter = Injecter;
  context.Consumer = Consumer;

  return context as ReactContext<T>;
}

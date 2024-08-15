import React, { RefObject, createRef, Component } from 'react';
// 对 f-engine 只有类型引用
import { Canvas, CanvasProps as FCanvasProps, Children } from '@antv/f-engine';

export interface CanvasProps {
  className?: string;
  pixelRatio?: number;
  width?: number | string;
  height?: number | string;
  padding?: (string | number)[];
  animate?: boolean;
  canvasRef?: RefObject<HTMLCanvasElement>;
  ref?: RefObject<HTMLCanvasElement>;
  children?: React.ReactElement | React.ReactElement[] | null;
  fallback?: JSX.Element | null;
  onError?: (error: Error) => void;
  autoFit?: boolean;
}

export interface CanvasState {
  error: any;
}

function pickElement(children) {
  if (!children) return children;
  const result = Children.map(children, (item) => {
    if (!item) return item;

    const { key, ref, type, props } = item;
    return {
      key,
      ref,
      type,
      props: {
        ...props,
        children: pickElement(props.children),
      },
    };
  });
  return result;
}

const createCanvas = (CanvasClass: typeof Canvas) => {
  class FCanvas extends CanvasClass {
    // override
    toRawChildren(children) {
      return pickElement(children);
    }
  }

  return class ReactCanvas extends Component<CanvasProps, CanvasState> {
    canvasRef: RefObject<HTMLCanvasElement>;
    canvas: Canvas;
    parentNode: {
      width: number;
      height: number;
    };
    observer: ResizeObserver;

    constructor(props: CanvasProps) {
      super(props);
      const { canvasRef } = props;
      this.canvasRef = canvasRef || createRef();
      this.state = { error: null };
    }

    catchError(error) {
      const { onError } = this.props;
      this.setState({ error });

      console.error('图表渲染失败: ', error);
      if (typeof onError === 'function') {
        onError(error);
      }

      // 重新抛出，为了让 window.onerror 捕获
      setTimeout(() => {
        throw error;
      }, 0);
    }

    getProps = () => {
      const { canvasRef, props } = this;
      const canvasEl = canvasRef.current;
      const context = canvasEl.getContext('2d');

      //  去掉 react 生成的 element 中无用属性
      const children = pickElement(props.children);

      return {
        // 已经有高清方案，这里默认用1
        pixelRatio: 1,
        ...props,
        children,
        // context 内部创建，不能被覆盖
        context,
      } as FCanvasProps;
    };

    componentDidMount() {
      const pickProps = this.getProps();
      const canvas = new FCanvas(pickProps);
      this.canvas = canvas;

      canvas.render().catch((error) => {
        this.catchError(error);
      });

      const targetNode = this.canvasRef.current?.parentElement;
      if (!targetNode) return;
      const { width, height } = targetNode.getBoundingClientRect();
      this.parentNode = {
        width: Math.round(width),
        height: Math.round(height),
      };

      this.observeElement();
    }

    observeElement() {
      if (!this.props?.autoFit) return;
      const targetNode = this.canvasRef.current?.parentElement;
      window?.addEventListener('resize', () => {
        this.resize();
      });

      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(() => {
          this.resize();
        });
        this.observer.observe(targetNode);
      }
    }

    resize() {
      const targetNode = this.canvasRef.current?.parentElement;
      if (!targetNode) return;
      const { width, height } = targetNode.getBoundingClientRect();
      const lastWidth = Math.round(width);
      const lastHeight = Math.round(height);
      if (
        (lastWidth === this.parentNode.width && lastHeight === this.parentNode.height) ||
        !lastWidth ||
        !lastHeight
      )
        return;
      this.parentNode = {
        width: lastWidth,
        height: lastHeight,
      };

      this.canvas.resize(lastWidth, lastHeight);
    }

    componentDidUpdate() {
      const { state, canvas } = this;
      const { error } = state;
      if (error) {
        return;
      }
      const pickProps = this.getProps();
      canvas.update(pickProps).catch((error) => {
        this.catchError(error);
      });
    }

    render() {
      const { props, state } = this;
      const { className = '', fallback } = props;
      const { error } = state;

      if (error) {
        // 直接销毁
        this.destroy();
        return fallback || null;
      }

      return React.createElement('canvas', {
        className: `f-chart ${className}`,
        ref: this.canvasRef,
        style: {
          width: '100%',
          height: '100%',
          display: 'block',
          padding: 0,
          margin: 0,
        },
      });
    }

    componentWillUnmount() {
      this.destroy();
    }

    destroy() {
      const { canvas } = this;
      if (!canvas) return;
      canvas.destroy();
      this.canvas = null;

      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
    }
  };
};

export { createCanvas };

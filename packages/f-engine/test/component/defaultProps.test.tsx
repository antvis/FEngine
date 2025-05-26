import { Canvas, Component, jsx } from '../../src';
import { createContext, delay } from '../util';

describe('defaultProps', () => {
  it('组件应该正确使用 defaultProps 的默认值', async () => {
    const context = createContext('defaultProps测试');
    const mockCallback = jest.fn();

    class ComponentWithDefaults extends Component {
      static defaultProps = {
        color: 'blue',
        size: 50
      };

      render() {
        const { color, size } = this.props;
        mockCallback({ color, size });
        return (
          <rect
            attrs={{
              fill: color,
              height: `${size}px`,
              width: `${size}px`,
            }}
          />
        );
      }
    }

    // 不传入任何 props，应该使用默认值
    const { props: props1 } = (
      <Canvas context={context} pixelRatio={1}>
        <ComponentWithDefaults />
      </Canvas>
    );

    const canvas1 = new Canvas(props1);
    await canvas1.render();

    // 传入部分 props，应该合并默认值
    const { props: props2 } = (
      <Canvas context={context} pixelRatio={1}>
        <ComponentWithDefaults color="red" />
      </Canvas>
    );

    const canvas2 = new Canvas(props2);
    await canvas2.render();

    expect(mockCallback.mock.calls[0][0]).toEqual({ color: 'blue', size: 50 });
    expect(mockCallback.mock.calls[1][0]).toEqual({ color: 'red', size: 50 });
  });

  it('子组件更新时应该正确处理 defaultProps', async () => {
    const context = createContext('子组件defaultProps更新测试');
    const mockCallback = jest.fn();

    class ChildComponent extends Component {
      static defaultProps = {
        color: 'blue',
        size: 50
      };

      render() {
        const { color, size } = this.props;
        mockCallback({ color, size });
        return (
          <rect
            attrs={{
              fill: color,
              height: `${size}px`,
              width: `${size}px`,
            }}
          />
        );
      }
    }

    class ParentComponent extends Component {
      state = {
        childColor: undefined,
        childSize: undefined
      };

      didMount() {
        // 延迟更新子组件的属性
        setTimeout(() => {
          this.setState({
            childColor: 'red',
            childSize: 100
          });
        }, 100);
      }

      render() {
        const { childColor, childSize } = this.state;
        return (
          <ChildComponent 
            color={childColor}
            size={childSize}
          />
        );
      }
    }

    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <ParentComponent />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    // 初始渲染应该使用默认值
    expect(mockCallback.mock.calls[0][0]).toEqual({ color: 'blue', size: 50 });

    // 等待状态更新
    await delay(200);

    // 更新后应该使用新的属性值
    expect(mockCallback.mock.calls[1][0]).toEqual({ color: 'red', size: 100 });
  });

  it('函数式组件应该正确使用 defaultProps', async () => {
    const context = createContext('函数式组件defaultProps测试');
    const mockCallback = jest.fn();

    function FunctionComponent(props) {
      const { color, size } = props;
      mockCallback({ color, size });
      return (
        <rect
          attrs={{
            fill: color,
            height: `${size}px`,
            width: `${size}px`,
          }}
        />
      );
    }

    FunctionComponent.defaultProps = {
      color: 'purple',
      size: 80
    };

    // 测试场景1：不传入任何属性
    const { props: props1 } = (
      <Canvas context={context} pixelRatio={1}>
        <FunctionComponent />
      </Canvas>
    );

    const canvas1 = new Canvas(props1);
    await canvas1.render();

    // 测试场景2：传入部分属性
    const { props: props2 } = (
      <Canvas context={context} pixelRatio={1}>
        <FunctionComponent color="orange" />
      </Canvas>
    );

    const canvas2 = new Canvas(props2);
    await canvas2.render();

    // 测试场景3：传入全部属性
    const { props: props3 } = (
      <Canvas context={context} pixelRatio={1}>
        <FunctionComponent color="yellow" size={120} />
      </Canvas>
    );

    const canvas3 = new Canvas(props3);
    await canvas3.render();

    // 验证所有场景
    expect(mockCallback.mock.calls[0][0]).toEqual({ color: 'purple', size: 80 }); // 使用全部默认值
    expect(mockCallback.mock.calls[1][0]).toEqual({ color: 'orange', size: 80 }); // 部分使用默认值
    expect(mockCallback.mock.calls[2][0]).toEqual({ color: 'yellow', size: 120 }); // 不使用默认值
  });

  it('函数式组件在属性更新时应该正确处理 defaultProps', async () => {
    const context = createContext('函数式组件defaultProps更新测试');
    const mockCallback = jest.fn();

    function FunctionComponent(props) {
      const { color, size } = props;
      mockCallback({ color, size });
      return (
        <rect
          attrs={{
            fill: color,
            height: `${size}px`,
            width: `${size}px`,
          }}
        />
      );
    }

    FunctionComponent.defaultProps = {
      color: 'purple',
      size: 80
    };

    const canvas = new Canvas({
      context,
      pixelRatio: 1,
      children: [<FunctionComponent />]
    });
    
    // 初始渲染：使用全部默认值
    await canvas.render();
    expect(mockCallback.mock.calls[0][0]).toEqual({ color: 'purple', size: 80 });

    // 更新部分属性
    await canvas.update({
      context,
      pixelRatio: 1,
      children: [<FunctionComponent color="pink" />]
    });
    expect(mockCallback.mock.calls[1][0]).toEqual({ color: 'pink', size: 80 });

    // 更新全部属性
    await canvas.update({
      context,
      pixelRatio: 1,
      children: [<FunctionComponent color="brown" size={150} />]
    });
    expect(mockCallback.mock.calls[2][0]).toEqual({ color: 'brown', size: 150 });
  });
});

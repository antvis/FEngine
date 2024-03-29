import { jsx, Canvas, Component } from '../src';
import { createContext, delay } from './util';
const context = createContext();

const methodCallback = jest.fn((method: string, params?) => method);

function pickMethod(calls) {
  return calls.map(([method]) => [method]);
}

class Test extends Component {
  willMount() {
    methodCallback('componentWillMount', this.props);
  }

  didMount() {
    methodCallback('componentDidMount', this.props);
  }

  shouldUpdate(nextProps) {
    methodCallback('componentShouldUpdate', nextProps);
    return true;
  }

  willReceiveProps(nextProps) {
    methodCallback('componentWillReceiveProps', nextProps);
  }

  willUpdate() {
    methodCallback('componentWillUpdate');
  }

  didUpdate() {
    methodCallback('componentDidUpdate');
  }

  willUnmount() {
    methodCallback('componentWillUnmount');
  }

  didUnmount() {
    methodCallback('componentDidUnmount');
  }

  render() {
    methodCallback('componentRender');
    const { props } = this;

    const { width = 0 } = props;
    return (
      <rect
        attrs={{
          x: 0,
          y: 0,
          fill: 'red',
          width,
          height: 10,
        }}
        animation={{
          appear: {
            easing: 'linear',
            duration: 30,
            property: ['width'],
            start: {
              width: 0,
            },
            end: {},
          },
          update: {
            easing: 'linear',
            duration: 30,
            property: ['width'],
          },
        }}
      />
    );
  }
}

class TestContainer extends Component {
  willMount() {
    methodCallback('containerWillMount');
  }

  didMount() {
    methodCallback('containerDidMount');
  }

  shouldUpdate() {
    methodCallback('containerShouldUpdate');
    return true;
  }

  willReceiveProps(nextProps) {
    methodCallback('containerWillReceiveProps', nextProps);
  }

  willUpdate() {
    methodCallback('containerWillUpdate');
  }

  didUpdate() {
    methodCallback('containerDidUpdate');
  }

  willUnmount() {
    methodCallback('containerWillUnmount');
  }

  didUnmount() {
    methodCallback('containerDidUnmount');
  }

  render() {
    methodCallback('containerRender');
    const { props } = this;

    const { children } = props;
    return children;
  }
}

describe('Canvas', () => {
  it('生命周期', async () => {
    const ref = { current: null };
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <TestContainer>
          <Test width={10} ref={ref} />
          <Test width={10} />
        </TestContainer>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(0);

    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
    ]);

    await delay(50);
    await canvas.update(
      (
        <Canvas context={context} pixelRatio={1}>
          <TestContainer>
            <Test width={20} ref={ref} />
          </TestContainer>
        </Canvas>
      ).props,
    );
    await delay(0);
    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentWillUnmount'],
      ['componentDidUnmount'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerDidUpdate'],
    ]);
    expect(methodCallback.mock.calls[15]).toEqual(['componentShouldUpdate', { width: 20 }]);
    expect(methodCallback.mock.calls[16]).toEqual(['componentWillReceiveProps', { width: 20 }]);

    await delay(50);
    ref.current.forceUpdate();
    await delay(100);
    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentWillUnmount'],
      ['componentDidUnmount'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerDidUpdate'],
      ['componentShouldUpdate'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
    ]);

    await delay(50);
    await canvas.update(
      (
        <Canvas context={context} pixelRatio={1}>
          <TestContainer animate={false}>
            <Test width={30} ref={ref} />
          </TestContainer>
        </Canvas>
      ).props,
    );
    await delay(100);
    expect(ref.current.container.children[0].getAttribute('width')).toBe(30);
    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentWillUnmount'],
      ['componentDidUnmount'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerDidUpdate'],
      ['componentShouldUpdate'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerDidUpdate'],
    ]);

    await delay(50);
    // 销毁 canvas
    canvas.destroy();

    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentWillUnmount'],
      ['componentDidUnmount'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerDidUpdate'],
      ['componentShouldUpdate'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['componentRender'],
      ['componentDidUpdate'],
      ['containerDidUpdate'],
      ['containerWillUnmount'],
      ['componentWillUnmount'],
      ['componentDidUnmount'],
      ['containerDidUnmount'],
    ]);
  });

  it('第1个子组件为空', async () => {
    methodCallback.mockClear();

    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <TestContainer>
          {null}
          <Test width={10} id="2" />
        </TestContainer>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    await delay(50);
    canvas.update(
      (
        <Canvas context={context} pixelRatio={1}>
          <TestContainer>
            <Test width={20} id="1" />
            <Test width={10} id="2" />
          </TestContainer>
        </Canvas>
      ).props,
    );
    await delay(0);

    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
      ['containerShouldUpdate'],
      ['containerWillReceiveProps'],
      ['containerWillUpdate'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidUpdate'],
    ]);

    expect(methodCallback.mock.calls[2]).toEqual(['componentWillMount', { width: 10, id: '2' }]);
    expect(methodCallback.mock.calls[10]).toEqual(['componentWillMount', { width: 20, id: '1' }]);
  });

  it('children is null', async () => {
    const methodCallback = jest.fn((method: string) => method);

    class TestNull extends Component {
      willMount() {
        methodCallback('componentWillMount');
      }

      didMount() {
        methodCallback('componentDidMount');
      }

      shouldUpdate() {
        methodCallback('componentShouldUpdate');
        return true;
      }

      willReceiveProps(nextProps) {
        methodCallback('componentWillReceiveProps');
      }

      willUpdate() {
        methodCallback('componentWillUpdate');
      }

      didUpdate() {
        methodCallback('componentDidUpdate');
      }
      render() {
        methodCallback('render');
        return null;
      }
    }
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <TestNull />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(50);
    canvas.update(
      (
        <Canvas context={context} pixelRatio={1}>
          <TestNull a={1} />
        </Canvas>
      ).props,
    );
    await delay(50);
    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['componentWillMount'],
      ['render'],
      ['componentDidMount'],
      ['componentShouldUpdate'],
      ['componentWillReceiveProps'],
      ['componentWillUpdate'],
      ['render'],
      ['componentDidUpdate'],
    ]);
  });

  it('属性无变化', async () => {
    methodCallback.mockClear();

    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <TestContainer>
          {null}
          <Test width={10} id="2" />
        </TestContainer>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(50);
    await canvas.update(
      (
        <Canvas context={context} pixelRatio={1}>
          <TestContainer>
            {null}
            <Test width={10} id="2" />
          </TestContainer>
        </Canvas>
      ).props,
    );
    await delay(10);

    expect(pickMethod(methodCallback.mock.calls)).toEqual([
      ['containerWillMount'],
      ['containerRender'],
      ['componentWillMount'],
      ['componentRender'],
      ['componentDidMount'],
      ['containerDidMount'],
    ]);
  });
});

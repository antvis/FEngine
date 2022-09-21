// @ts-nocheck
/* @jsx React.createElement */
import { Canvas, Component, jsx } from '@antv/f-engine';
import { Renderer } from '@antv/g-mobile-canvas';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import ReactCanvas from '../src';

// @ts-ignore
Enzyme.configure({ adapter: new Adapter() });

function App(props: any) {
  const { chartRef, a } = props;
  const renderer = new Renderer();
  return (
    <ReactCanvas
      ref={chartRef}
      width={100}
      height={100}
      className="newClass"
      renderer={renderer}
      a={a}
    >
      <circle
        style={{
          x: 150,
          y: 50,
          r: 40,
          fill: 'red',
        }}
      />
    </ReactCanvas>
  );
}

describe('<Canvas >', () => {
  it('Chart render', async () => {
    const chartRef = React.createRef<any>();
    const lineRef = React.createRef<any>();

    const wrapper = mount(<App chartRef={chartRef} lineRef={lineRef} />);

    // 渲染为异步，渲染完才可以拿到完整的ref
    await chartRef.current.ready;

    expect(wrapper.html()).toBe(
      '<canvas class="f-chart newClass" width="100" height="100" style="width: 100px; height: 100px; display: block; padding: 0px; margin: 0px;"></canvas>'
    );

    const reactChart = chartRef.current;

    // 断言实例生成和ref正确性
    expect(reactChart.canvas).toBeInstanceOf(Canvas);

    expect(reactChart.canvas.children.shape).toBeDefined();
    expect(reactChart.props.a).toBeUndefined();

    // 触发update
    await wrapper.setProps({ a: 2 });
    // await delay();
    expect(reactChart.props.a).toBe(2);

    wrapper.unmount();
  });

  it('Chart render with Error', async () => {
    const chartRef = React.createRef<any>();
    const spyOnConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    class Test extends Component {
      render() {
        throw new Error('Render Error');
      }
    }

    const onError = jest.fn();
    const renderer = new Renderer();

    const wrapper = mount(
      <ReactCanvas
        fallback={<div>Chart Fallback</div>}
        ref={chartRef}
        onError={onError}
        renderer={renderer}
      >
        <Test />
      </ReactCanvas>
    );

    await chartRef.current.ready;

    // 断言 fallback 触发
    expect(wrapper.instance().state.error.toString()).toBe('Error: Render Error');

    // 断言 onError 触发
    expect(onError.mock.calls.length).toBe(1);
    expect(spyOnConsoleError).toHaveBeenCalled();

    spyOnConsoleError.mockRestore();
  });
});

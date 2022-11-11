// @ts-nocheck
/* @jsx React.createElement */
import { Canvas, Component } from '@antv/f-engine';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import ReactCanvas from '../src';

// @ts-ignore
Enzyme.configure({ adapter: new Adapter() });

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function App(props: any) {
  const { canvasRef } = props;
  return (
    <ReactCanvas ref={canvasRef} width={100} height={100} className="newClass">
      <circle
        style={{
          r: 40,
          fill: 'red',
        }}
      />
    </ReactCanvas>
  );
}

describe('<Canvas >', () => {
  it('render', () => {
    const canvasRef = React.createRef<any>();

    const wrapper = mount(<App canvasRef={canvasRef} />);
    expect(wrapper.html()).toBe(
      '<canvas class="f-chart newClass" width="100" height="100" style="width: 100px; height: 100px; display: block; padding: 0px; margin: 0px;"></canvas>'
    );

    const reactCanvas = canvasRef.current;
    // 断言实例生成和ref正确性
    expect(reactCanvas.canvas).toBeInstanceOf(Canvas);

    wrapper.unmount();
  });

  it('Canvas render with Error', async () => {
    const spyOnError = jest.spyOn(window, 'onerror').mockImplementation(() => {});
    const spyOnConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    class Test extends Component {
      render() {
        throw new Error('Render Error');
      }
    }

    const onError = jest.fn();

    const wrapper = mount(
      <ReactCanvas fallback={<div>Chart Fallback</div>} onError={onError}>
        <Test />
      </ReactCanvas>
    );

    await delay(500);
    wrapper.update();
    // 断言 fallback 触发
    expect(wrapper.html()).toBe('<div>Chart Fallback</div>');

    // 断言 onError 触发
    expect(onError.mock.calls.length).toBe(1);
    expect(spyOnError).toHaveBeenCalled();

    spyOnError.mockRestore();
    spyOnConsoleError.mockRestore();

    wrapper.unmount();
  });
});

import { jsx, Canvas, Component } from '../../src';
import { createContext, delay, gestureSimulator } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

describe('Event', () => {
  it('Event', async () => {
    const onPan = jest.fn();
    const onClick = jest.fn();
    const renderer = new Renderer();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <rect
          style={{
            width: '200px',
            height: '200px',
            fill: 'red',
          }}
          onPan={onPan}
          onClick={onClick}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(200);
    gestureSimulator(context.canvas, 'touchstart', { x: 60, y: 60 });
    gestureSimulator(context.canvas, 'touchmove', { x: 62, y: 80 });
    gestureSimulator(context.canvas, 'touchend', { x: 62, y: 80 });
    await delay(200);

    expect(onPan.mock.calls.length).toBe(1);
    // move不触发click事件
    expect(onClick.mock.calls.length).toBe(0);
  });
});

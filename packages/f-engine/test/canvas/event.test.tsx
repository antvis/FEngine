import { jsx, Canvas, Gesture } from '../../src';
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

  it('new event', async () => {
    const renderer = new Renderer();
    const context = createContext('new event ');
    const ref = { current: null };
    const onPan = jest.fn();
    const onPress = jest.fn();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <group ref={ref}>
          <rect
            ref={ref}
            style={{
              width: '200px',
              height: '200px',
              fill: 'red',
            }}
            onPan={onPan}
          />
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    const gesture = new Gesture(ref.current);
    gesture.on('press', onPress);

    await delay(1000);
    // 模拟 press 事件
    gestureSimulator(context.canvas, 'touchstart', { x: 60, y: 70 });
    gestureSimulator(context.canvas, 'touchmove', { x: 93, y: 35 });
    // 移动出canvas外
    gestureSimulator(context.canvas, 'touchmove', { x: 500, y: 35 });
    gestureSimulator(context.canvas, 'touchend', { x: 93, y: 35 });

    expect(onPan.mock.calls.length).toBe(2);
    expect(onPress.mock.calls.length).toBe(2);
  });

  it('change data event has changed', async () => {
    const onClick = jest.fn();
    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            width: '200px',
            height: '200px',
            fill: 'red',
          }}
          onClick={() => {
            onClick('rect1');
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(300);
    gestureSimulator(context.canvas, 'click', { x: 10, y: 10 });
    await delay(100);
    expect(onClick.mock.calls[0][0]).toBe('rect1');

    const { props: newProps } = (
      <Canvas context={context}>
        <rect
          style={{
            width: '200px',
            height: '200px',
            fill: 'red',
          }}
          onClick={() => {
            onClick('rect2');
          }}
        />
      </Canvas>
    );
    await canvas.update(newProps);
    gestureSimulator(context.canvas, 'click', { x: 10, y: 10 });
    await delay(100);
    expect(onClick.mock.calls[1][0]).toBe('rect2');
  });
});

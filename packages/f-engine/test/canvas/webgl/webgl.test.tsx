import { jsx, Canvas } from '../../../src';
import { Renderer } from '@antv/g-mobile-webgl';
import { delay, gestureSimulator } from '../../util';

const canvasEl = document.createElement('canvas');
canvasEl.style.display = 'block';
canvasEl.style.width = '300px';
canvasEl.style.height = '200px';
document.body.appendChild(canvasEl);

const context = canvasEl.getContext('webgl');

describe('webgl', () => {
  it('webgl renderer', async () => {
    const renderer = new Renderer();
    const onPan = jest.fn();
    const onClick = jest.fn();
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

    await delay(500);
    gestureSimulator(canvasEl, 'touchstart', { x: 60, y: 60 });
    gestureSimulator(canvasEl, 'touchmove', { x: 62, y: 80 });
    gestureSimulator(canvasEl, 'touchend', { x: 62, y: 80 });
    await delay(500);

    expect(onPan.mock.calls.length).toBe(1);
    // move不触发click事件
    expect(onClick.mock.calls.length).toBe(0);

    await delay(100);
    gestureSimulator(canvasEl, 'click', { x: 60, y: 60 });
    expect(onClick.mock.calls.length).toBe(1);
  });
});

import { jsx, Canvas } from '../../../src';
import { Renderer } from '@antv/g-mobile-webgl';

const canvasEl = document.createElement('canvas');
canvasEl.style.display = 'block';
canvasEl.style.width = '300px';
canvasEl.style.height = '200px';
document.body.appendChild(canvasEl);

const context = canvasEl.getContext('webgl');

describe('webgl', () => {
  it('webgl renderer', async () => {
    const renderer = new Renderer();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <rect
          style={{
            width: '200px',
            height: '200px',
            fill: 'red',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
  });
});

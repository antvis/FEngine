import { jsx, Canvas } from '../../../src';
import { Renderer } from '@antv/g-mobile-svg';

const container = document.createElement('div');
container.style.width = '300px';
container.style.height = '200px';
document.body.appendChild(container);

describe('svg', () => {
  it('svg renderer', async () => {
    const renderer = new Renderer();
    const { props } = (
      <Canvas renderer={renderer} container={container} width={300} height={200}>
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

    // @ts-ignore
    const dataURL = await canvas.canvas.context.contextService.toDataURL();
    expect(dataURL).toBe(
      'data:image/svg+xml;charset=utf8,%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20color-interpolation-filters%3D%22sRGB%22%20style%3D%22background%3A%20transparent%3B%22%3E%3Cdefs%2F%3E%3Cg%20id%3D%22g-svg-camera%22%20transform%3D%22matrix(1%2C0%2C0%2C1%2C0%2C0)%22%3E%3Cg%20id%3D%22g-svg-0%22%20fill%3D%22none%22%20stroke%3D%22none%22%20visibility%3D%22visible%22%20font-size%3D%2212px%22%20font-family%3D%22%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Helvetica%2C%20%26quot%3BPingFang%20SC%26quot%3B%2C%20%26quot%3BHiragino%20Sans%20GB%26quot%3B%2C%20%26quot%3BMicrosoft%20YaHei%26quot%3B%2C%20Arial%2C%20sans-serif%22%20font-style%3D%22normal%22%20font-weight%3D%22normal%22%20font-variant%3D%22normal%22%20text-anchor%3D%22left%22%20stroke-dashoffset%3D%220px%22%20transform%3D%22matrix(1%2C0%2C0%2C1%2C0%2C0)%22%2F%3E%3Cg%20id%3D%22g-svg-1-g%22%3E%3Cpath%20id%3D%22g-svg-1%22%20fill%3D%22rgba(255%2C0%2C0%2C1)%22%20d%3D%22M%200%2C0%20l%20100%2C0%20l%200%2C100%20l-100%200%20z%22%20stroke%3D%22none%22%20width%3D%22100px%22%20height%3D%22100px%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
    );
  });
});

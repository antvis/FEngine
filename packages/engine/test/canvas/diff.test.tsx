import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class Circle extends Component {
  render() {
    return (
      <circle
        style={{
          cx: 60,
          cy: 60,
          r: 50,
          fill: 'red',
        }}
      />
    );
  }
}

function Rect() {
  return (
    <rect
      style={{
        x: 20,
        y: 20,
        width: 100,
        height: 100,
        fill: 'blue',
      }}
    />
  );
}

describe('Canvas', () => {
  it('渲染顺序', async () => {
    const renderer = new Renderer();
    const { props } = (
      <Canvas renderer={renderer} context={context} animate={false}>
        <Rect id={1} />
        {null}
        <Circle />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(100);

    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas renderer={renderer} context={context}>
        {null}
        <Rect id={2} />
        <Circle id={3} />
      </Canvas>
    );

    await canvas.update(update.props);

    await delay(100);
    expect(context).toMatchImageSnapshot();
  });
});

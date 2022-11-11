import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class Rect extends Component {
  render() {
    const { fill } = this.props;
    return (
      <rect
        style={{
          x: 0,
          y: 0,
          fill,
          width: 50,
          height: 50,
        }}
      />
    );
  }
}

describe('zIndex', () => {
  it('zIndex', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <Rect zIndex={2} fill={'yellow'} />
        <Rect fill={'red'} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas renderer={renderer} context={context}>
        <Rect fill={'yellow'} />
        <Rect fill={'red'} />
      </Canvas>
    );
    canvas.update(update.props);
  });
});

import { jsx, Fragment, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile';

class View extends Component {
  render() {
    return (
      <>
        <rect
          style={{
            x: '10px',
            y: '10px',
            width: '80px',
            height: '80px',
            fill: 'red',
          }}
        />
      </>
    );
  }
}

describe('Canvas', () => {
  it('Fragment Function', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
  });
});

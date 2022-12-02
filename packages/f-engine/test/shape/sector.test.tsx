import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

class View extends Component {
  render() {
    return (
      <sector
        style={{
          cx: 100,
          cy: 60,
          startAngle: 0,
          endAngle: 90,
          r: 60,
          r0: 10,
          fill: 'red',
          radius: [0, 8, 8, 0],
        }}
      />
    );
  }
}

describe('Sector', () => {
  it('Sector', async () => {
    const { props } = (
      <Canvas context={context}>
        <View />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

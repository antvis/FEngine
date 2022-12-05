import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

class View extends Component {
  render() {
    return (
      <sector
        style={{
          cx: 150,
          cy: 60,
          startAngle: 0,
          endAngle: 90,
          r: 60,
          r0: 10,
          fill: 'red',
          stroke: 'black',
          radius: [0, 8, 8, 0],
        }}
      />
    );
  }
}

class View1 extends Component {
  render() {
    return (
      <sector
        style={{
          cx: 60,
          cy: 60,
          startAngle: 0,
          endAngle: 90,
          r: 60,
          r0: 10,
          fill: 'red',
          stroke: 'black',
          radius: [5, 5, 30, 30],
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
  it('内角合并', async () => {
    const { props } = (
      <Canvas context={context}>
        <View1 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

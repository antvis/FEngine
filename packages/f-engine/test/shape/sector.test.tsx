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
      <group>
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

        <sector
          style={{
            cx: 200,
            cy: 60,
            startAngle: 0,
            endAngle: 90,
            r: 60,
            r0: 10,
            fill: 'red',
            stroke: 'black',
            anticlockwise: true,
            radius: [5, 5, 30, 30],
          }}
        />

        <sector
          style={{
            cx: 60,
            cy: 200,
            startAngle: 0,
            endAngle: 270,
            r: 60,
            r0: 10,
            fill: 'red',
            stroke: 'black',
            anticlockwise: true,
            radius: [100, 100, 0, 0],
          }}
        />
      </group>
    );
  }
}

class View3 extends Component {
  render() {
    return (
      <group>
        <sector
          style={{
            cx: 150,
            cy: 150,
            startAngle: 0,
            endAngle: 90,
            r: 60,
            r0: 20,
            fill: 'yellow',
            stroke: 'black',
            anticlockwise: true,
            radius: [8, 8, 8, 8],
          }}
        />
        <sector
          style={{
            cx: 150,
            cy: 150,
            startAngle: 0,
            endAngle: 270,
            r: 60,
            r0: 20,
            fill: 'red',
            stroke: 'black',
            anticlockwise: true,
            radius: [8, 8, 8, 8],
          }}
        />
      </group>
    );
  }
}

class View4 extends Component {
  render() {
    return (
      <group>
        <sector
          style={{
            cx: 150,
            cy: 150,
            startAngle: 0,
            endAngle: 270,
            r: 60,
            r0: 20,
            fill: 'green',
            stroke: 'black',
            radius: [0, 0, 0, 0],
          }}
        />
        <sector
          style={{
            cx: 150,
            cy: 150,
            startAngle: 0,
            endAngle: 270,
            r: 60,
            r0: 20,
            fill: 'red',
            stroke: 'black',
            anticlockwise: true,
            radius: [0, 0, 0, 0],
          }}
        />
        <sector
          style={{
            cx: 150,
            cy: 150,
            startAngle: 0,
            endAngle: 270,
            r: 60,
            r0: 20,
            fill: 'yellow',
            stroke: 'black',
            anticlockwise: true,
            radius: [8, 8, 8, 8],
          }}
        />
      </group>
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
  it('clockwise', async () => {
    const { props } = (
      <Canvas context={context}>
        <View3 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
  it('radius 不同', async () => {
    const { props } = (
      <Canvas context={context}>
        <View4 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

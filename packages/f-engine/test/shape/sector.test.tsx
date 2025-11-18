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

class View5 extends Component {
  render() {
    return (
      <group>
        <sector
          style={{
            cx: 100,
            cy: 150,
            startAngle: -90,
            endAngle: -90,
            r: 60,
            r0: 20,
            fill: 'green',
            stroke: 'black',
          }}
        />
        <sector
          style={{
            cx: 190,
            cy: 150,
            startAngle: -90,
            endAngle: 0,
            r: 60,
            r0: 20,
            fill: 'red',
            stroke: 'black',
          }}
        />
      </group>
    );
  }
}

class View6 extends Component {
  render() {
    return (
      <group>
        <sector
          style={{
            cx: 40,
            cy: 40,
            startAngle: 0,
            endAngle: 0.001,
            r: 26,
            r0: 8,
            fill: 'red',
            stroke: 'black',
            radius: [4, 4, 2, 2],
          }}
        />
        <sector
          style={{
            cx: 100,
            cy: 40,
            startAngle: 0,
            endAngle: 0.001,
            r: 26,
            r0: 8,
            fill: 'red',
            stroke: 'black',
            radius: [4, 4, 2, 2],
            anticlockwise: true,
          }}
        />
        <sector
          style={{
            cx: 40,
            cy: 100,
            startAngle: 90.001,
            endAngle: 90,
            r: 26,
            r0: 8,
            fill: 'red',
            stroke: 'black',
            radius: [4, 4, 2, 2],
          }}
        />
        <sector
          style={{
            cx: 100,
            cy: 100,
            startAngle: 90.001,
            endAngle: 90,
            r: 26,
            r0: 8,
            fill: 'red',
            stroke: 'black',
            radius: [4, 4, 2, 2],
            anticlockwise: true,
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
  it('临界数值 0 angle', async () => {
    const { props } = (
      <Canvas context={context}>
        <View5 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('逆时针绘制', async () => {
    const { props } = (
      <Canvas context={context}>
        <sector
          style={{
            cx: 150,
            cy: 150,
            startAngle: -90,
            endAngle: -160,
            r: 50,
            r0: 10,
            fill: '#1890FF',
            anticlockwise: true,
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
  describe('整圆', () => {
    it('顺时针', async () => {
      const { props } = (
        <Canvas context={context}>
          <sector
            style={{
              cx: 150,
              cy: 150,
              r: 50,
              r0: 20,
              startAngle: 0,
              endAngle: 360,
              fill: 'red',
            }}
          />
        </Canvas>
      );

      const canvas = new Canvas(props);
      canvas.render();
      await delay(500);
      expect(context).toMatchImageSnapshot();
    });

    it('逆时针', async () => {
      const { props } = (
        <Canvas context={context}>
          <sector
            style={{
              cx: 150,
              cy: 150,
              r: 50,
              r0: 20,
              startAngle: 0,
              endAngle: -360,
              fill: 'blue',
            }}
          />
        </Canvas>
      );

      const canvas = new Canvas(props);
      canvas.render();
      await delay(500);
      expect(context).toMatchImageSnapshot();
    });
  });

  describe('sector clip', () => {
    it('clip', async () => {
      const { props } = (
        <Canvas context={context}>
          <circle
            style={{
              cx: 110,
              cy: 110,
              r: 100,
              fill: 'radial-gradient(circle at center, red, blue, green 100%)',
              clip: {
                type: 'sector',
                style: {
                  cx: 110,
                  cy: 110,
                  r: 100,
                  startAngle: 100,
                  endAngle: 190,
                },
              },
            }}
          />
        </Canvas>
      );

      const canvas = new Canvas(props);
      canvas.render();
      await delay(500);
      expect(context).toMatchImageSnapshot();
    });
  });

  it('角度从非0到0', async () => {
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <sector
          style={{
            cx: 150,
            cy: 120,
            fill: 'red',
            startAngle: '-1.57rad',
            endAngle: '4.36rad',
            r0: 60,
            r: 100,
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas context={context} pixelRatio={1}>
        <sector
          style={{
            cx: 150,
            cy: 120,
            fill: 'red',
            startAngle: '1rad',
            endAngle: '1rad',
            r0: 60,
            r: 100,
          }}
        />
      </Canvas>
    );
    await canvas.update(update.props);
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('极小角度扇形区域', async () => {
    const { props } = (
      <Canvas context={context}>
        <View6 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
  it('padAngle 绘制', async () => {
    const { props } = (
      <Canvas context={context}>
        <group>
          <sector
            style={{
              cx: 100,
              cy: 80,
              startAngle: 0,
              endAngle: 90,
              r: 60,
              r0: 10,
              fill: 'red',
              stroke: 'black',
              radius: [0, 8, 8, 0],
            }}
          />
          <sector
            style={{
              cx: 100,
              cy: 80,
              startAngle: 0,
              endAngle: 90,
              r: 60,
              r0: 10,
              fill: 'red',
              stroke: 'black',
              radius: [0, 8, 8, 0],
              padAngle: 40,
            }}
          />
          <sector
            style={{
              cx: 260,
              cy: 80,
              startAngle: 0,
              endAngle: 20,
              r: 60,
              r0: 10,
              fill: 'blue',
              stroke: 'black',
              radius: [0, 8, 8, 0],
              padAngle: 40,
            }}
          />
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
  it('padAngle 绘制 anticlockwise', async () => {
    const { props } = (
      <Canvas context={context}>
        <group>
          <sector
            style={{
              cx: 100,
              cy: 100,
              startAngle: 0,
              endAngle: 90,
              r: 60,
              r0: 10,
              fill: 'green',
              stroke: 'black',
              radius: [0, 8, 8, 0],
              anticlockwise: true,
            }}
          />
          <sector
            style={{
              cx: 100,
              cy: 100,
              startAngle: 0,
              endAngle: 90,
              r: 60,
              r0: 10,
              fill: 'green',
              stroke: 'black',
              radius: [0, 8, 8, 0],
              padAngle: 30,
              anticlockwise: true,
            }}
          />
        </group>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });
});

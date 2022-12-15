import { jsx, Canvas, Component, computeLayout } from '../../../src';
import { createContext, delay } from '../../util';

class Rect extends Component {
  render() {
    const { color } = this.props;
    return (
      <rect
        style={{
          x: 10,
          y: 10,
          width: 50,
          height: 50,
          fill: color,
        }}
      />
    );
  }
}

class Circle extends Component {
  render() {
    const { color } = this.props;
    return (
      <circle
        style={{
          cx: 35,
          cy: 35,
          r: 25,
          fill: color,
        }}
      />
    );
  }
}

class Circle1 extends Component {
  render() {
    const { color } = this.props;
    return (
      <circle
        style={{
          cx: 35,
          cy: 35,
          r: 25,
          fill: color,
        }}
      />
    );
  }
}

describe('图形绘制顺序', () => {
  it('图形绘制顺序', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <Rect color="red" />
        <Circle color="blue" />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(500);
    expect(context).toMatchImageSnapshot();

    const update = (
      <Canvas context={context}>
        <Rect color="red" />
        <Circle1 color="blue" />
      </Canvas>
    );
    await delay(500);
    await canvas.update(update.props);
    expect(context).toMatchImageSnapshot();
  });
});

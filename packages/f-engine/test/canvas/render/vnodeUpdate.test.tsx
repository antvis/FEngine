import { jsx, Canvas, Component, createRef } from '../../../src';
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

describe('vnode 更新', () => {
  it('vnode 更新', async () => {
    const ref = createRef();

    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <Rect ref={ref} color="red" />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    const update = (
      <Canvas context={context}>
        <Rect ref={ref} color="red" update />
      </Canvas>
    );
    await delay(500);
    await canvas.update(update.props);

    expect(ref.current._vNode.props.update).toBe(true);
  });
  it('基础图形更新', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            width: 36,
            height: 36,
            fill: 'red',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    const { props: nextProps } = (
      <Canvas context={context}>
        <circle
          style={{
            cx: 80,
            cy: 30,
            r: 20,
            lineWidth: 2,
            stroke: '#e45649',
            fill: 'blue',
          }}
        />
      </Canvas>
    );
    await delay(500);
    await canvas.update(nextProps);

    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});

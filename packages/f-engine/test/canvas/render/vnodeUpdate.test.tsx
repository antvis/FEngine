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
});

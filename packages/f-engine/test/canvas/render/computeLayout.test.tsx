import { jsx, Canvas, Component, computeLayout } from '../../../src';
import { createContext, delay } from '../../util';

const getElementsByClassNameFn = jest.fn();

class View extends Component {
  private maxWidth: number;

  willMount(): void {
    const node = computeLayout(this, this.render());

    getElementsByClassNameFn(node.getElementsByClassName('text'));

    const { children } = node;
    let maxWidth = 0;
    children.forEach((child: any) => {
      const { layout } = child;
      const { width } = layout;
      maxWidth = Math.max(maxWidth, width);
    });
    this.maxWidth = maxWidth;
  }
  render() {
    const { maxWidth } = this;
    return (
      <group
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: 200,
        }}
      >
        <text
          className="text"
          style={{
            padding: [0, '10px'],
            width: maxWidth,
            text: 'hello',
          }}
        />
        <text
          className="text"
          style={{
            width: maxWidth,
            text: 'world',
          }}
        />
      </group>
    );
  }
}

describe('computeLayout', () => {
  it('布局计算', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <View />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(100);

    expect(context).toMatchImageSnapshot();
    expect(getElementsByClassNameFn.mock.calls[0][0].length).toEqual(2);
  });
});

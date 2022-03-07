import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import GRender from '../../src/g-render';
import JSONRender from '../../src/json-render';

class View extends Component {
  render() {
    return (
      <group>
        <rect
          attrs={{
            x: '10px',
            y: '10px',
            width: '80px',
            height: '80px',
            fill: 'red',
          }}
        />
        <circle
          attrs={{
            x: '150px',
            y: '50px',
            r: '40px',
            fill: 'red',
          }}
        />
      </group>
    );
  }
}

function View1() {
  return <group></group>;
}

function View2(props) {
  return props.children;
}

describe('Canvas', () => {
  it('g render', async () => {
    const renderer = new GRender();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
        <View1 />
        <View2>
          <View />
          <View1 />
        </View2>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
  });

  it('json render', async () => {
    const renderer = new JSONRender();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
        <View1 />
        <View2>
          <View />
          <View1 />
        </View2>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    const json = renderer.root;
    expect(json).toEqual({
      type: 'canvas',
      props: {
        children: [
          {
            type: 'group',
            props: {
              children: [
                {
                  type: 'rect',
                  props: { attrs: { x: 5, y: 5, width: 40, height: 40, fill: 'red' } },
                },
                { type: 'circle', props: { attrs: { x: 75, y: 25, r: 20, fill: 'red' } } },
              ],
            },
          },
          { type: 'group', props: {} },
          {
            type: 'group',
            props: {
              children: [
                {
                  type: 'rect',
                  props: { attrs: { x: 5, y: 5, width: 40, height: 40, fill: 'red' } },
                },
                { type: 'circle', props: { attrs: { x: 75, y: 25, r: 20, fill: 'red' } } },
              ],
            },
          },
          { type: 'group', props: {} },
        ],
      },
    });
  });
});

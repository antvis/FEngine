import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

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
          animation={{
            appear: {
              easing: 'linear',
              duration: 300,
              delay: 0,
              property: ['fillOpacity'],
              start: {
                fillOpacity: 0,
              },
              end: {
                fillOpacity: 1,
              },
            },
          }}
        />
        <circle
          attrs={{
            x: '150px',
            y: '50px',
            r: '50px',
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

function View2() {
  return <View />;
}

describe('Canvas', () => {
  it('图形绘制', async () => {
    const { props } = (
      <Canvas context={context}>
        <View />
        <View1 />
        <View2 />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    // await delay(100);
    // expect(context).toMatchImageSnapshot();
  });
});

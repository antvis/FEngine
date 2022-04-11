import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile';

class View extends Component {
  render() {
    const { id } = this.props;
    if (id === 1) {
      return (
        <group
          style={{
            x: 50,
            y: 50,
            width: 250,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <circle
            style={{
              r: 20,
              fill: '#000',
            }}
            animation={{
              appear: {
                // easing: 'linear',
                duration: 400,
                // delay: 0,
                // property: ['fillOpacity'],
                start: {
                  r: 0,
                },
                end: {
                  r: 20,
                },
              },
            }}
          />
          <rect
            style={{
              width: 40,
              height: 40,
              fill: 'red',
            }}
            animation={{
              appear: {
                // easing: 'linear',
                duration: 400,
                // delay: 0,
                // property: ['fillOpacity'],
                start: {
                  width: 0,
                },
                end: {
                  width: 40,
                },
              },
              leave: {
                duration: 400,
                start: {
                  width: 40,
                },
                end: {
                  width: 0,
                },
              },
            }}
            onPanEnd={() => {
              console.log('pan end');
            }}
          />
        </group>
      );
    }

    return (
      <group
        style={{
          x: 50,
          y: 70,
          width: 250,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <circle
          style={{
            r: 20,
            fill: '#000',
          }}
          animation={{
            update: {
              duration: 1000,
            },
          }}
        />
        {[1, 2, 3].map((d) => (
          <rect
            style={{
              width: 40,
              height: 40,
              fill: 'red',
            }}
            animation={{
              update: {
                // easing: 'linear',
                duration: 1000,
                // delay: 0,
                property: ['fillOpacity', 'fill'],
                start: {
                  fill: '#000',
                },
                end: {
                  fill: 'red',
                },
              },
            }}
            onClick={() => {
              console.log('click rect');
            }}
            onDbClick={() => {
              console.log('dbclick');
            }}
            onPanStart={() => {
              console.log('pan start');
            }}
            onPan={() => {
              console.log('pan');
            }}
            onPanEnd={() => {
              console.log('pan end');
            }}
          />
        ))}
      </group>
    );
  }
}

describe('Canvas', () => {
  it('morph animate', async () => {
    const renderer = new Renderer();
    await delay(1000);

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View id={1} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    await delay(1000);

    const update = (
      <Canvas renderer={renderer} context={context}>
        <View id={2} />
      </Canvas>
    );

    canvas.update(update.props);
  });
});

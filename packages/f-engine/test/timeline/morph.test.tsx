import { jsx, Canvas, Component, Timeline, Fragment } from '../../src';
import { createContext, delay } from '../util';

class Group extends Component {
  render() {
    return (
      <group>
        <rect
          style={{
            x: 100,
            y: 10,
            width: 20,
            height: 20,
            fill: 'red',
          }}
          animation={{
            update: {
              duration: 100,
              property: ['fill'],
            },
          }}
        />

        <rect
          style={{
            x: 150,
            y: 10,
            width: 20,
            height: 20,
            fill: 'red',
          }}
          animation={{
            update: {
              duration: 100,
              property: ['fill'],
            },
          }}
        />
      </group>
    );
  }
}

class Circle extends Component {
  render() {
    return (
      <circle
        style={{
          cx: 20,
          cy: 20,
          r: 10,
          fill: 'blue',
        }}
        animation={{
          update: {
            duration: 100,
            property: ['fill'],
          },
        }}
      />
    );
  }
}

describe('形变动画', () => {
  it('group 到 circle', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <Timeline>
          <Group />
          <Circle />
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await delay(100);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });

  it('circle 到 group', async () => {
    const context = createContext();
    const { props } = (
      <Canvas context={context}>
        <Timeline>
          <Circle />
          <Group />
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await delay(100);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});

import { jsx, Canvas, Component, createRef } from '../../src';
import Timeline from '../../src/timeline';
import { Renderer } from '@antv/g-mobile-canvas';
import { createContext, delay } from '../util';
const context = createContext();

class Rect extends Component {
  render() {
    const { index, width = 0 } = this.props;
    return (
      <group>
        <rect
          style={{
            x: 0,
            y: 0,
            fill: 'red',
            width,
            height: 10,
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 300,
              property: ['width'],
              start: {
                width: 0,
              },
              end: {},
            },
            update: {
              easing: 'linear',
              duration: 300,
              property: ['width'],
            },
          }}
        />
        <text
          style={{
            x: 0,
            y: 30,
            text: `${index}`,
            fill: '#000',
            fontSize: '30px',
          }}
        />
      </group>
    );
  }
}

const Cirlce = (props) => {
  const { index } = props;
  return (
    <group>
      <circle
        style={{
          cx: 20,
          cy: 20,
          r: 10,
          fill: 'red',
        }}
        animation={{
          appear: {
            easing: 'linear',
            duration: 300,
            property: ['r'],
            start: {
              r: 0,
            },
            end: {
              r: 10,
            },
          },
          update: {
            easing: 'linear',
            duration: 300,
            property: [],
          },
        }}
      />
      <text
        style={{
          x: 0,
          y: 30,
          text: `${index}`,
          fill: '#000',
          fontSize: '30px',
        }}
      />
    </group>
  );
};

describe('Timeline', () => {
  it('timeline 播放', async () => {
    const renderer = new Renderer();
    const rectRef = createRef();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <Timeline start={0}>
          {[10, 100].map((v, index) => {
            return <Rect ref={rectRef} index={index} width={v} />;
          })}
          <Cirlce transformFrom={rectRef} index={2} />
        </Timeline>
      </Canvas>
    );

    await delay(100);

    const canvas = new Canvas(props);
    canvas.render();

    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });
});

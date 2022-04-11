import { jsx, Canvas, Component } from '../../src';
import Timeline from '../../src/timeline';
import { Renderer } from '@antv/g-mobile';
import { createContext } from '../util';
const context = createContext();

class View extends Component {
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

describe('Timeline', () => {
  it('timeline 播放', () => {
    const renderer = new Renderer();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <Timeline delay={1000} start={0}>
          {[10, 100, 60, 200, 30].map((v, index) => {
            return <View index={index} width={v} />;
          })}
        </Timeline>
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
  });
});

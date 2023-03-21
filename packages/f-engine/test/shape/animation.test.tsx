import { jsx, Canvas, Component, createRef } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

class View extends Component {
  render() {
    return (
      <group>
        <arc
          style={{
            stroke: '#F04864',
            r: 40,
            cx: 50,
            cy: 50,
            startAngle: '0rad',
            endAngle: `${(Math.PI * 4) / 3}rad`,
          }}
          animation={{
            appear: {
              easing: 'ease',
              duration: 5000,
              property: ['endAngle'],
              start: {
                endAngle: '0rad',
              },
              end: {
                endAngle: `${(Math.PI * 4) / 3}rad`,
              },
            },
          }}
        />
        <sector
          style={{
            stroke: 'black',
            fill: '#F04864',
            cx: 150,
            cy: 100,
            lineWidth: 2,
            r: 50,
            // r0: 30,
            startAngle: '0rad',
            endAngle: '3.89rad',
            radius: [5, 10],
          }}
          animation={{
            appear: {
              easing: 'ease',
              duration: 2000,
              property: ['endAngle', 'r'],
              start: {
                r: 30,
                endAngle: '0rad',
              },
              end: {
                r: 50,
                endAngle: '3.89rad',
              },
            },
          }}
        />
      </group>
    );
  }
}

class View1 extends Component {
  render() {
    return (
      <group
        animation={{
          appear: {
            easing: 'quadraticOut',
            duration: 450,
            clip: {
              type: 'sector',
              property: ['endAngle'],
              style: {
                cx: 50,
                cy: 50,
                startAngle: `${0}rad`,
                r: 50,
              },
              start: {
                endAngle: `${0}rad`,
              },
              end: {
                endAngle: `${6.28}rad`,
              },
            },
          },
        }}
      >
        <circle
          style={{
            stroke: '#F04864',
            r: 40,
            cx: 50,
            cy: 50,
          }}
        />
      </group>
    );
  }
}
describe('Canvas', () => {
  it('custom shape animation', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View />
      </Canvas>
    );

    await delay(2000);

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });
  it('clip animation', async () => {
    const renderer = new Renderer();
    const context = createContext('clip animation');

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <View1 />
      </Canvas>
    );

    await delay(2000);

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);
    expect(context).toMatchImageSnapshot();
  });

  it('line', async () => {
    // pionts 暂不支持 插值，无动画
    const renderer = new Renderer();
    const context = createContext('line');

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <polyline
          style={{
            points: [
              [0, 3],
              [20, 10],
              [30, 80],
              [40, 40],
            ],
            stroke: 'blue',
          }}
          animation={{
            update: {
              easing: 'linear',
              duration: 1000,
              property: ['points'],
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(500);

    const { props: nextProps } = (
      <Canvas renderer={renderer} context={context}>
        <polyline
          style={{
            points: [
              [0, 10],
              [20, 80],
              [50, 40],
              [70, 10],
            ],
            stroke: 'blue',
            smooth: true,
          }}
          animation={{
            update: {
              easing: 'linear',
              duration: 4000,
              property: ['points'],
            },
          }}
        />
      </Canvas>
    );

    await canvas.update(nextProps);
  });

  // 报错
  it.skip('line offsetPath', async () => {
    const renderer = new Renderer();
    const context = createContext('line');

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <polyline
          style={{
            points: [
              [0, 3],
              [50, 10],
              [130, 80],
              [250, 40],
            ],
            stroke: 'blue',
          }}
          animation={{
            appear: {
              easing: 'quadraticOut',
              duration: 1000,
              property: ['points'],
              clip: {
                type: 'rect',
                property: ['width'],
                style: {
                  x: 0,
                  y: 0,
                  height: 225,
                },
                start: {
                  width: 0,
                },
                end: {
                  width: 250,
                },
              },
            },
          }}
        />
        <circle
          style={{
            fill: '#808080',
            r: 10,
            offset: {
              type: 'polyline',
              style: {
                points: [
                  [0, 3],
                  [50, 10],
                  [130, 80],
                  [250, 40],
                ],
              },
            },
          }}
          animation={{
            appear: {
              easing: 'quadraticOut',
              duration: 1000,
              property: ['offsetDistance'],
              start: {
                offsetDistance: 0,
              },
              end: {
                offsetDistance: 1,
              },
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1500);
    expect(context).toMatchImageSnapshot();
  });

  it.skip('offsetPath 为 ref', async () => {
    const renderer = new Renderer();
    const context = createContext('offsetPath-ref');
    const ref = createRef();
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <polyline
          ref={ref}
          style={{
            points: [
              [0, 3],
              [50, 10],
              [130, 80],
              [250, 40],
            ],
            stroke: 'blue',
          }}
          animation={{
            appear: {
              easing: 'quadraticOut',
              duration: 1000,
              property: ['points'],
              clip: {
                type: 'rect',
                property: ['width'],
                style: {
                  x: 0,
                  y: 0,
                  height: 225,
                },
                start: {
                  width: 0,
                },
                end: {
                  width: 250,
                },
              },
            },
          }}
        />
        <circle
          style={{
            fill: '#808080',
            r: 10,
            offset: ref,
          }}
          animation={{
            appear: {
              easing: 'quadraticOut',
              duration: 1000,
              property: ['offsetDistance'],
              start: {
                offsetDistance: 0,
              },
              end: {
                offsetDistance: 1,
              },
            },
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1500);
    expect(context).toMatchImageSnapshot();
  });
});

import { jsx, Canvas, Component, createRef } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';


describe('polyline', () => {
    it('polyline', async () => {
        const renderer = new Renderer();
        const context = createContext('polyline');
    
        const { props } = (
          <Canvas renderer={renderer} context={context}>
            <polyline
              style={{
                points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                ],
                stroke: 'blue'
              }}
              animation={{
                update: {
                  easing: 'linear',
                  duration: 100,
                  property: ['points'],
                },
              }}
            />
          </Canvas>
        );
        const canvas = new Canvas(props);
        await canvas.render();
        await delay(500);
        expect(context).toMatchImageSnapshot();
    })
    it('step start polyline', async () => {
        const renderer = new Renderer();
        const context = createContext('step start polyline');
    
        const { props } = (
          <Canvas renderer={renderer} context={context}>
            <polyline
              style={{
                points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                ],
                stroke: 'blue'
              }}
              animation={{
                update: {
                  easing: 'linear',
                  duration: 100,
                  property: ['points'],
                },
              }}
            />
              <polyline
                style={{
                  points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                  ],
                  stroke: 'red',
                  step: 'start',
                }}
                animation={{
                  update: {
                    easing: 'linear',
                    duration: 200,
                    property: ['points'],
                  },
                }}
              />
          </Canvas>
        );
        const canvas = new Canvas(props);
        await canvas.render();
        await delay(500);
        expect(context).toMatchImageSnapshot();
    })
    it('step middle polyline', async () => {
        const renderer = new Renderer();
        const context = createContext('step middle polyline');
    
        const { props } = (
          <Canvas renderer={renderer} context={context}>
            <polyline
              style={{
                points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                ],
                stroke: 'blue'
              }}
              animation={{
                update: {
                  easing: 'linear',
                  duration: 100,
                  property: ['points'],
                },
              }}
            />
              <polyline
                style={{
                  points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                  ],
                  stroke: 'red',
                  step: 'middle',
                }}
                animation={{
                  update: {
                    easing: 'linear',
                    duration: 200,
                    property: ['points'],
                  },
                }}
              />
          </Canvas>
        );
        const canvas = new Canvas(props);
        await canvas.render();
        await delay(500);
        expect(context).toMatchImageSnapshot();
    })
    it('step end polyline', async () => {
        const renderer = new Renderer();
        const context = createContext('step end polyline');
    
        const { props } = (
          <Canvas renderer={renderer} context={context}>
            <polyline
              style={{
                points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                ],
                stroke: 'blue'
              }}
              animation={{
                update: {
                  easing: 'linear',
                  duration: 100,
                  property: ['points'],
                },
              }}
            />
              <polyline
                style={{
                  points: [
                    [0, 10],
                    [20, 80],
                    [40, 40],
                    [60, 10],
                    [80, 60]
                  ],
                  stroke: 'red',
                  step: 'end'
                }}
                animation={{
                  update: {
                    easing: 'linear',
                    duration: 200,
                    property: ['points'],
                  },
                }}
              />
          </Canvas>
        );
        const canvas = new Canvas(props);
        await canvas.render();
        await delay(500);
        expect(context).toMatchImageSnapshot();
    })
});
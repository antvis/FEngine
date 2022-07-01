import { jsx, Canvas, Sunburst } from '../../../src';
import { createContext, delay } from '../../util';

describe('Sunburst Chart', () => {
  it('旭日图', async () => {
    fetch('https://gw.alipayobjects.com/os/antfincdn/9ZSLra9rgm/basic.json')
      .then((res) => res.json())
      .then(async (data) => {
        const context = createContext();
        const { props } = (
          <Canvas context={context} pixelRatio={1}>
            <Sunburst
              data={data.children}
              coord={{
                type: 'polar',
              }}
              yField="value"
              color={{
                field: 'name',
              }}
              space={4}
            />
          </Canvas>
        );

        const canvas = new Canvas(props);
        await canvas.render();
        await delay(1000);
        expect(context).toMatchImageSnapshot();
      });
  });

  it('火焰图', async () => {
    fetch('https://gw.alipayobjects.com/os/antfincdn/9ZSLra9rgm/basic.json')
      .then((res) => res.json())
      .then(async (data) => {
        const context = createContext();
        const { props } = (
          <Canvas context={context} pixelRatio={1}>
            <Sunburst
              data={data.children}
              yField="value"
              color={{
                field: 'name',
              }}
              space={4}
            />
          </Canvas>
        );

        const canvas = new Canvas(props);
        await canvas.render();

        await delay(1000);
        expect(context).toMatchImageSnapshot();
      });
  });
});

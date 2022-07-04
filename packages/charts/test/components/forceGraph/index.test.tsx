import { jsx, Canvas, ForceGraph } from '../../../src';
import { createContext, delay } from '../../util';
import data from './data';
const context = createContext();

describe('Force Graph', () => {
  it('力导图', async () => {
    const { type, props } = (
      <Canvas context={context} pixelRatio={2} width={500} height={600}>
        <ForceGraph data={data}></ForceGraph>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    // expect(context).toMatchImageSnapshot();
  });
});

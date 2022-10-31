import { jsx, Canvas } from '@antv/f-engine';
import Lottie from '../src/index';
import { createContext, delay } from './util';

describe('Lottie', () => {
  it('加载 lottie 文件', async () => {
    const res = await fetch('https://g-next.antv.vision/zh/examples/data/lottie/data1.json');
    const data = await res.json();

    const res1 = await fetch(
      'https://gw.alipayobjects.com/os/OasisHub/3ccdf4d8-78e6-48c9-b06e-9e518057d144/data.json'
    );
    const data1 = await res1.json();

    const context = createContext('', {
      width: '600px',
      height: '600px',
    });

    const { props } = (
      <Canvas context={context}>
        <rect
          style={{
            x: 20,
            y: 20,
            width: 100,
            height: 100,
            fill: 'blue',
          }}
        />
        <Lottie data={data} options={{ loop: true, autoplay: true }} />
        <Lottie data={data1} options={{ loop: true, autoplay: true }} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
  });
});

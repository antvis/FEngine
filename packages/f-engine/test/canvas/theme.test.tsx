import { transform } from '@antv/util';
import { jsx, Canvas, Component } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();

class Text extends Component {
  width: number;
  height: number;

  constructor(props, context) {
    super(props, context);
    const { textStyle } = props;
    const { width, height } = this.context.measureText('0.123', textStyle);
    this.width = width;
    this.height = height;
  }
}

describe('Theme', () => {
  describe('字体主题设置', () => {
    it('默认主题', async () => {
      const textRef = { current: null };
      const { props } = (
        <Canvas context={context} pixelRatio={1}>
          <Text ref={textRef} />
        </Canvas>
      );

      const canvas = new Canvas(props);
      canvas.render();
      await delay(0);

      expect(textRef.current.width).toBeCloseTo(31.02);
    });

    it('自定义设置', async () => {
      const textRef = { current: null };
      const { props } = (
        <Canvas
          context={context}
          pixelRatio={1}
          theme={{
            fontFamily: '"Heiti SC"',
          }}
        >
          <Text ref={textRef} />
        </Canvas>
      );

      const canvas = new Canvas(props);
      canvas.render();
      await delay(0);

      expect(textRef.current.width).toBeCloseTo(30.916);
    });
  });
});

describe('measureText', () => {
  it('旋转', async () => {
    const textRef = { current: null };
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Text
          ref={textRef}
          textStyle={{
            transform: 'rotate(90deg)',
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(0);
    expect(textRef.current.height).toBeCloseTo(31.02);
  });
});

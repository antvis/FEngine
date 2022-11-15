import { jsx, Canvas, Component, createRef } from '../src';
import { createContext } from './util';

const context = createContext();

interface TestProps {
  fill?: string;
}

class Test extends Component<TestProps> {
  render() {
    return null;
  }
}

describe('types', () => {
  it('key & ref', () => {
    const ref = createRef();
    const { props } = (
      <Canvas context={context}>
        <Test key={1} ref={ref}>
          <Test />
        </Test>
      </Canvas>
    );
  });
});

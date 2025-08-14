import { jsx, Canvas, Component, computeLayout } from '../../../src';
import { computeComponent } from '../../../src/canvas/render/computeComponent';
import { createContext, delay } from '../../util';

class View extends Component {
  willMount(): void {}
  render() {
    const { position } = this.props;
    return (
      <group
        style={{
          fill: 'red',
        }}
      >
        <circle
          style={{
            cx: position[0],
            cy: position[1],
            r: 20,
            fill: 'red',
          }}
        />
      </group>
    );
  }
}

class ViewText extends Component {
  willMount(): void {}
  render() {
    const { position } = this.props;
    return (
      <group
        style={{
          fill: 'red',
        }}
      >
        <text
          style={{
            x: position[0],
            y: position[1],
            text: 'hello',
          }}
        />
      </group>
    );
  }
}

class GuideGroup extends Component {
  bbox = [];

  willMount(): void {
    const { children } = this.props;
    const { updater, context } = this;
    const childArray = Array.isArray(children) ? children : [children];
    childArray.map((child) => {
      const component = new child.type(child.props, context, updater);
      component.context = context;

      const bbox = computeComponent(this, component.render());
      this.bbox.push(bbox);
    });
  }
  render() {
    const { children } = this.props;
    return <group>{children}</group>;
  }
}

describe('computeComponent', () => {
  it('组件bbox计算', async () => {
    const context = createContext();
    const ref = { current: null };
    const guideGroupRef = { current: null };
    const { props } = (
      <Canvas context={context}>
        <GuideGroup ref={guideGroupRef}>
          <ViewText position={[40, 40]} ref={ref} />
          <View position={[70, 70]} />
        </GuideGroup>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(100);

    const bbox = guideGroupRef.current.bbox;

    expect(bbox[0].x).toEqual(40);
    expect(bbox[0].y).toEqual(28);
    expect(bbox[0].width).toBeGreaterThan(0);
    expect(bbox[0].height).toBeGreaterThan(0);

    expect(bbox[1].x).toEqual(50);
    expect(bbox[1].y).toEqual(50);
    expect(bbox[1].width).toEqual(40);
    expect(bbox[1].height).toEqual(40);
  });
});

import { jsx, Canvas, Component } from '../../../src';
import { getWorkTag } from '../../../src/canvas/workTags';
import { computeComponentBBox } from '../../../src/canvas/render';
import { createContext, delay } from '@antv/f-test-utils';

const FunctionComponent = 0;
const ClassComponent = 1;

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

class ViewWithDisplayGroup extends Component {
  willMount(): void {}
  render() {
    const { style, position = [20, 0] } = this.props;
    return (
      <group
        style={{
          fill: 'blue',
          display: 'flex',
          x: position[0],
          y: position[1],
          ...style,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <text
          style={{
            text: 'hello',
            textAlign: 'start',
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
      <text
        style={{
          x: position[0],
          y: position[1],
          text: 'hello',
        }}
      />
    );
  }
}

const ViewWithDisplay = (props) => {
  return <ViewWithDisplayGroup {...props} />;
};
class GuideGroup extends Component {
  bbox = [];

  willMount(): void {
    const { children } = this.props;
    const { updater, context } = this;
    const childArray = Array.isArray(children) ? children : [children];
    childArray.map((child) => {
      const tag = getWorkTag(child.type);
      let element = child;

      if (tag === FunctionComponent) {
        element = child.type(child.props, context, updater);
      }
      const component = new element.type({ ...element.props }, context, updater);
      component.context = context;
      const newElement = component.render();
      const bbox = computeComponentBBox(this, newElement);
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

  it('View内的group带display样式', async () => {
    const context = createContext();
    const guideGroupRef = { current: null };
    const { props } = (
      <Canvas context={context}>
        <GuideGroup ref={guideGroupRef}>
          <ViewWithDisplayGroup />
          <ViewWithDisplay position={[20, 20]} />
        </GuideGroup>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(100);

    const bbox = guideGroupRef.current.bbox;
    expect(bbox[0].x).toEqual(20);
    expect(bbox[0].y).toEqual(0);
    expect(bbox[0].width).toBeGreaterThan(20);
    expect(bbox[0].height).toBeGreaterThan(10);

    expect(bbox[1].x).toEqual(20);
    expect(bbox[1].y).toEqual(20);
  });

  it('View内的group带padding样式', async () => {
    const context = createContext();

    const guideGroupRef = { current: null };
    const { props } = (
      <Canvas context={context}>
        <GuideGroup ref={guideGroupRef}>
          <ViewWithDisplayGroup position={[0, 0]} style={{ padding: [20, 20, 20, 20] }} />
        </GuideGroup>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(100);

    const bbox = guideGroupRef.current.bbox;

    expect(bbox[0].x).toEqual(0);
    expect(bbox[0].y).toEqual(0);
    expect(bbox[0].width).toBeGreaterThan(40);
    expect(bbox[0].height).toBeGreaterThan(40);
  });
});

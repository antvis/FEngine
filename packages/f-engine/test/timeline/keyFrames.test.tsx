import { jsx, Canvas, Component, Player, Timeline } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      
      const {
        width = '80px',
        height = '80px',
        opacity = 1,
        fill = 'red',
        visible = true,
        fillFunc
      } = this.props;
      if (!visible) return;
      return (
        <rect
          style={{
            width,
            height,
            fill: fillFunc ? fillFunc() : fill ,
            opacity,
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 500,
              property: ['width'],
            },
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'fill','width', 'height'],
            },
          }}
        />
      );
    }
  }

  class View1 extends Component {
    render() {
      const { r = 5 } = this.props;
      return (
        <circle
          style={{
            cx: 100,
            cy: 40,
            r,
            fill: 'yellow',
          }}
          animation={{
            update: {
              easing: 'linear',
              duration: 500,
              property: ['r'],
            },
          }}
        />
      );
    }
  }

  class View3 extends Component {
    render() {
      const {
        width = '80px',
        height = '80px',
        opacity = 1,
        fill = 'red',
        visible = true,
      } = this.props;
      if (!visible) return;
      return (
        <group
          animation={{
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'width', 'height'],
            },
            leave: {
              easing: 'linear',
              duration: 1000,
              property: ['opacity'],
              end: {
                opacity: 0,
              },
            },
          }}
        >
          <rect
            style={{
              width,
              height,
              fill,
            }}
          />
        </group>
      );
    }
  }
  it('子组件', async () => {
    const context = createContext('子组件');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            {
              view: {
                to: {
                  width: '5px',
                },
              },
              view1: {
                to: {
                  r: '5px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
              view1: {
                to: {
                  r: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
              view1: {
                to: {
                  r: '80px',
                },
              },
            },
          ]}
        >
          <group>
            <View key={'view'} width={'5px'} />
            <View1 key={'view1'} r={'5px'}></View1>
          </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });

  it('keyFrames', async () => {
    const context = createContext('切片动画');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: false,
                  width: '5px',
                },
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });

  it('finish', async () => {
    const context = createContext('动画 finish');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(10);

    // ref.current.playKeyFrame(2);
    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="finish"
          keyFrames={[
            {
              view: {
                to: {
                  width: '10px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '40px',
                },
              },
            },
            {
              view: {
                to: {
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} />
        </Player>
      </Canvas>
    );

    canvas.update(newProps);
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  it('更新子组件 props', async () => {
    const context = createContext('更新子组件 props');
    const ref = { current: null };
    const callback = jest.fn();
    let color = "red"
    const { props } = (
      <Canvas context={context} >
        <Player
          state="play"
          ref={ref}
          onend={callback}
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: false,
                  width: '5px',
                },
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
              },
            },
          ]}
        >
          <View key={'view'} fillFunc={()=>{
            return color
          }}/>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);

    color = "yellow"
    const { props: nextProps } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: false,
                  width: '5px',
                },
              },
            },
            {
              view: {
                to: {
                  visible: true,
                  width: '80px',
                },
              },
            },
          ]}
          onend={callback}
        >
          <View 
          key={'view'} 
          fillFunc={()=>{
            return color
          }}/>
        </Player>
      </Canvas>
    );
    canvas.update(nextProps)
    await delay(2000);

    expect(callback.mock.calls.length).toBe(1);
    expect(context).toMatchImageSnapshot();
  });

  it('执行完清空动画', async () => {
    const context = createContext('清空动画');
    const ref = {current: null}
    const { props } = (
      <Canvas context={context}>
        <Player
        ref={ref}
          state="play"
          keyFrames={[
            // 先出现，再变宽
            {
              view: {
                to: {
                  visible: true,
                },
              },
            },
            {
              view1: {
                to: {
                  visible: true,
                },
              },
            },
            {
              view1: {
                to: {
                  visible: false,
                },
              },
            },
          ]}
        >
          <group>
          <View key={'view'} />
         <View1 key={'view1'}></View1>
         </group>
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(2000);
    expect(ref.current.context.timeline.animations[0].length).toEqual(0)
  });
  it.skip('leave 动画', async () => {
    const context = createContext('动画 finish');
    const ref = { current: null };
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          ref={ref}
          keyFrames={[
            {
              view: {
                to: {
                  visible: true,
                },
              },
            },
            {
              view: {
                to: {
                  visible: false,
                },
              },
            },
          ]}
        >
          <View3 key={'view'} width={'80px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(10);
    expect(context).toMatchImageSnapshot();
  });
});

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
        animate = true,
      } = this.props;
      if (!visible) return;
      return (
        <rect
          style={{
            width,
            height,
            fill,
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
              property: ['x', 'width', 'height'],
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
  it('子组件', async () => {
    const context = createContext('子组件');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            {
              view: {
                to: '40px',
                key: 'width',
              },
              view1: {
                to: '40px',
                key: 'r',
              },
            },
            {
              view: {
                to: '80px',
                key: 'width',
              },
              view1: {
                to: '80px',
                key: 'r',
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
                to: true,
                key: 'visible',
              },
            },
            {
              view: {
                to: '80px',
                key: 'width',
              },
            },
          ]}
        >
          <View key={'view'} width={'5px'} visible={false} />
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
                to: '40px',
                key: 'width',
              },
            },
            {
              view: {
                to: '80px',
                key: 'width',
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
                to: '40px',
                key: 'width',
              },
            },
            {
              view: {
                to: '80px',
                key: 'width',
              },
            },
          ]}
        >
          <View key={'view'} width={'10px'} />
        </Player>
      </Canvas>
    );

    canvas.update(newProps);
    await delay(100);
    expect(context).toMatchImageSnapshot();
  });

  //   const ref = { current: null };
  //   const { props } = (
  //     <Canvas context={context}>
  //       <Player
  //         state="finish"
  //         keyFrames={[
  //           {
  //             view: {
  //               to: 0,
  //               key: 'opacity',
  //             },
  //           },
  //           {
  //             view: {
  //               to: 0.5,
  //               key: 'opacity',
  //             },
  //           },
  //         ]}
  //       >
  //         <View key={'view'} opacity={1} />
  //       </Player>
  //     </Canvas>
  //   );

  //   const canvas = new Canvas(props);
  //   await canvas.render();
  //   await delay(10);
  //   // ref.current.replay();
  //   // const { props: newProps } = (
  //   //   <Canvas context={context}>
  //   //     <Player
  //   //       state="play"
  //   //       keyFrames={[
  //   //         {
  //   //           view: {
  //   //             to: 0,
  //   //             key: 'opacity',
  //   //           },
  //   //         },
  //   //         {
  //   //           view: {
  //   //             to: 0.5,
  //   //             key: 'opacity',
  //   //           },
  //   //         },
  //   //       ]}
  //   //     >
  //   //       <View key={'view'} opacity={1} />
  //   //     </Player>
  //   //   </Canvas>
  //   // );

  //   // canvas.update(newProps);
  // });
});

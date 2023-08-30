import { jsx, Canvas, Component, Player, Timeline } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      const { width = '10px', height = '80px', opacity, fill = 'red' } = this.props;
      return (
        <rect
          style={{
            width,
            height,
            fill,
            opacity,
          }}
          animation={{
            // appear: {
            //   easing: 'linear',
            //   duration: 2000,
            //   property: ['x', 'width', 'height', 'opacity'],
            // },
            update: {
              easing: 'linear',
              duration: 5000,
              property: ['x', 'width', 'height', 'opacity', 'fill'],
            },
          }}
        />
      );
    }
  }

  it('keyFrames', async () => {
    const context = createContext('切片动画');
    const { props } = (
      <Canvas context={context}>
        <Player
          frame={0}
          state="play"
          keyFrames={[
            {
              view: {
                to: 0,
                key: 'opacity',
              },
            },
            {
              view: {
                to: 1,
                key: 'opacity',
              },
            },
          ]}
        >
          <View key={'view'} opacity={1} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);
  });

  it('finish', async () => {
    const context = createContext('动画 finish');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            {
              view: {
                to: 0,
                key: 'opacity',
              },
            },
            {
              view: {
                to: 0.5,
                key: 'opacity',
              },
            },
          ]}
        >
          <View key={'view'} opacity={1} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(10);

    const { props: newProps } = (
      <Canvas context={context}>
        <Player
          state="finish"
          keyFrames={[
            {
              view: {
                to: 0,
                key: 'opacity',
              },
            },
            {
              view: {
                to: 0.5,
                key: 'opacity',
              },
            },
          ]}
        >
          <View key={'view'} opacity={1} />
        </Player>
      </Canvas>
    );

    canvas.update(newProps);
  });

  it.only('replay', async () => {
    const context = createContext('动画 replay');
    const { props } = (
      <Canvas context={context}>
        <Player
          state="play"
          keyFrames={[
            // {
            //   view: {
            //     to: '30px',
            //     key: 'width',
            //   },
            // },
            {
              view: {
                to: '50px',
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
          <View key={'view'} opacity={1} width={'10px'} />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    // await delay(10);

    // const { props: newProps } = (
    //   <Canvas context={context}>
    //     <Player
    //       state="play"
    //       keyFrames={[
    //         {
    //           view: {
    //             to: 'yellow',
    //             key: 'fill',
    //           },
    //         },
    //         {
    //           view: {
    //             to: 'blue',
    //             key: 'fill',
    //           },
    //         },
    //         {
    //           view: {
    //             to: 'green',
    //             key: 'fill',
    //           },
    //         },
    //       ]}
    //     >
    //       <View key={'view'} opacity={1} />
    //     </Player>
    //   </Canvas>
    // );

    // canvas.update(newProps);
  });
});

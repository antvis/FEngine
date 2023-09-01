import { jsx, Canvas, Component, Player, Timeline } from '../../src';
import { createContext, delay } from '../util';

describe('player', () => {
  class View extends Component {
    render() {
      const { width = '80px', height = '80px', opacity = 1, fill = 'red' } = this.props;
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
              easing: 'easeOut',
              duration: 1000,
              property: ['width'],
              start: {
                width: 0,
              },
              end: {
                width,
              },
            },
            update: {
              easing: 'linear',
              duration: 500,
              property: ['x', 'width', 'height'],
            },
            leave: {
              easing: 'easeIn',
              duration: 500,
              property: ['x', 'width', 'height'],
            },
          }}
        />
      );
    }
  }

  it.skip('元素未改变,只有播控props改变', async () => {
    const context = createContext('播控props改变');
    const { props } = (
      <Canvas context={context}>
        <Player state="pause">
          <View />
        </Player>
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(1000);

    expect(context).toMatchImageSnapshot();

    await canvas.update({
      children: (
        <Player state="play">
          <View />
        </Player>
      ),
    });

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });

  it('keyFrames', async () => {
    const context = createContext('切片动画');
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
    await delay(2000);
    expect(context).toMatchImageSnapshot();
  });

  it.only('finish', async () => {
    const context = createContext('动画 finish');
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

    await delay(1000);
    expect(context).toMatchImageSnapshot();
  });

  it('replay', async () => {
    const context = createContext('重播');
    const { props } = (
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

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(10);

    const { props: newProps } = (
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

    canvas.update(newProps);
  });
});

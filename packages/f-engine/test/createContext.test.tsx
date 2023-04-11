import { jsx, createContext, Canvas, Component } from '../src';
import { createContext as createCanvasContext, delay } from './util';
const context = createCanvasContext();

describe('createContext', () => {
  describe('Provider Context', () => {
    it('createContext', async () => {
      const { Provider, Consumer } = createContext<string>();

      const { props } = (
        <Canvas context={context}>
          <Provider value={'rect'}>
            <group>
              <rect
                style={{
                  width: 50,
                  height: 50,
                  fill: 'red',
                }}
              />
              <Consumer>
                {(name: string) => {
                  return (
                    <text
                      style={{
                        fill: '#000',
                        x: 20,
                        y: 20,
                        text: `${name}`,
                      }}
                    />
                  );
                }}
              </Consumer>
            </group>
          </Provider>
        </Canvas>
      );

      const canvas = new Canvas(props);
      await canvas.render();
      await delay(500);

      expect(context).toMatchImageSnapshot();
    });

    it('contextType', async () => {
      const customContext = createContext<string>();
      const { Provider } = customContext;

      class Test extends Component {
        static contextType = customContext;
        render() {
          return (
            <text
              style={{
                fill: '#000',
                x: 20,
                y: 20,
                text: `${this.context}`,
              }}
            />
          );
        }
      }

      const { props } = (
        <Canvas context={context}>
          <Provider value={'rect'}>
            <group>
              <rect
                style={{
                  width: 50,
                  height: 50,
                  fill: 'red',
                }}
              />
              <Test />
            </group>
          </Provider>
        </Canvas>
      );

      const canvas = new Canvas(props);
      await canvas.render();
      await delay(500);

      expect(context).toMatchImageSnapshot();
    });
  });

  describe('inject Context', () => {
    it('inject context', async () => {
      const customContext = createContext<string>();
      const { Injecter } = customContext;

      class Test extends Component {
        render() {
          const { left = 20 } = this.props;
          const { name } = this.context;
          return (
            <text
              style={{
                x: left,
                y: 20,
                fill: '#000',
                text: `${name}`,
              }}
            />
          );
        }
      }

      const { props } = (
        <Canvas context={context}>
          <Injecter name={'rect'}>
            <group>
              <rect
                style={{
                  width: 50,
                  height: 50,
                  fill: 'red',
                }}
              />
              <Test />
            </group>
          </Injecter>
          {/** 不在 Injecter 里面，取不到 context.name */}
          <Test left={60} />
        </Canvas>
      );

      const canvas = new Canvas(props);

      await canvas.render();
      await delay(500);

      expect(context).toMatchImageSnapshot();
    });
  });
});

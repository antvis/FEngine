import { Component } from '@antv/f-engine';

class Rect extends Component {
  render() {
    const { index, width = 100 } = this.props;
    return (
      <group>
        <rect
          style={{
            x: 0,
            y: 0,
            fill: 'red',
            width,
            height: 10,
          }}
          animation={{
            appear: {
              easing: 'linear',
              duration: 300,
              property: ['width'],
              start: {
                width: 0,
              },
              end: {},
            },
            update: {
              easing: 'linear',
              duration: 300,
              property: ['width'],
            },
          }}
        />
        <text
          style={{
            x: 0,
            y: 30,
            text: `${index}`,
            fill: '#000',
            fontSize: '30px',
          }}
        />
      </group>
    );
  }
}

export default Rect;

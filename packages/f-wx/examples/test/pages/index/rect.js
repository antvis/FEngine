import { Component } from '@antv/f-engine';
import { jsx as _jsx } from "@antv/f-engine/jsx-runtime";
import { jsxs as _jsxs } from "@antv/f-engine/jsx-runtime";
class Rect extends Component {
  render() {
    const {
      index,
      width = 100
    } = this.props;
    return _jsxs("group", {
      children: [_jsx("rect", {
        style: {
          x: 0,
          y: 0,
          fill: 'red',
          width,
          height: 10
        },
        animation: {
          appear: {
            easing: 'linear',
            duration: 300,
            property: ['width'],
            start: {
              width: 0
            },
            end: {}
          },
          update: {
            easing: 'linear',
            duration: 300,
            property: ['width']
          }
        }
      }), _jsx("text", {
        style: {
          x: 0,
          y: 30,
          text: `${index}`,
          fill: '#000',
          fontSize: '30px'
        }
      })]
    });
  }
}
export default Rect;
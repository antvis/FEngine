import { Component } from '@antv/f-engine';
import { loadAnimation } from '@antv/g-lottie-player';

class Lottie extends Component {
  render() {
    const { props, context } = this;
    const { data, options } = props;
    const animation = loadAnimation(data, options);
    animation.render(context.canvas);
    return null;
  }
}

export default Lottie;

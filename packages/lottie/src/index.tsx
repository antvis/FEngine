import { Component } from '@antv/f-engine';
import { loadAnimation } from '@antv/g-lottie-player';

class Lottie extends Component {
  render() {
    const { container, props } = this;
    const { data, options } = props;
    const animation = loadAnimation(data, options);
    // 因为添加到文档流是后执行的，所以这里加一个 setTimeout
    setTimeout(() => {
      animation.render(container);
    }, 0);
    return null;
  }
}

export default Lottie;

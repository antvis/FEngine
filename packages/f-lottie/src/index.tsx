import { Component, createRef, jsx, Ref, AnimationProps } from '@antv/f-engine';
import { loadAnimation } from '@antv/g-lottie-player';

interface LottieProps {
  // Lottie Json
  data: any;
  options?: {
    // 是否循环播放 次数 ｜ 无限
    loop?: number | boolean;
    // 是否自动播放
    autoplay?: boolean;
  };
  style?: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  };
  play?: {
    speed?: number;
    // 开始帧
    start?: number;
    // 结束帧
    end?: number;
  };
  animation?: AnimationProps;
}

class Lottie extends Component<LottieProps> {
  size: { width: number; height: number };
  ref: Ref;
  animation: any;

  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  didMount() {
    this.addLottie();
  }

  willUpdate() {
    this.addLottie();
  }

  addLottie = () => {
    const { props, context } = this;
    const { data, options, play } = props;
    const { canvas } = context;

    if (!data) return;

    // 文档流后挂载lottie
    canvas.ready.then(() => {
      this.animation = this.animation ? this.animation : loadAnimation(data, options);
      this.animation.render(this.ref.current);

      this.size = this.animation.size();
      this.updateSize();

      // 播放控制
      if (play) {
        const { speed = 1, start = 0, end = this.animation.getDuration(true) } = play;
        this.animation.setSpeed(speed);
        this.animation.playSegments([start, end]);
      }
    });
  };

  updateSize = () => {
    const { width: currentWidth, height: currentHeight } = this.size;
    const { style } = this.props;
    if (!style) return;

    const { width = currentWidth, height = currentHeight } = style;

    this.ref.current.scale(width / currentWidth, height / currentHeight);
    this.size = {
      width,
      height,
    };
  };

  render() {
    const { style, animation } = this.props;
    return <group ref={this.ref} style={style} animation={animation}></group>;
  }
}

export default Lottie;

import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Timeline from './canvas/timeline';
import { IAnimation } from '@antv/g-lite';

// 播放状态
type playState = 'play' | 'pause' | 'finish';

export interface PlayerProps {
  /**
   * 时间帧
   */
  frame?: number;
  /**
   * 播放状态
   */
  state?: playState;
  /**
   * 获取动画总帧数
   */
  getTotalFrame?: (frame: number) => void;
  /**
   * 获取当前帧数
   */
  getFrame?: (frame: number) => void;
  /**
   * 播放速率，默认为 1
   */
  speed?: number;
  /**
   * 播放结束回调函数
   */
  onfinish?: (frame: number) => void;
  children?: JSX.Element | null;
}

class Player extends Component<PlayerProps> {
  totalFrame: number = 0;
  maxTimeAnimation: IAnimation;

  private setPlayState() {
    const { props, context, maxTimeAnimation } = this;
    const {
      frame,
      state: playState,
      getTotalFrame = () => {},
      getFrame = () => {},
      speed,
      onfinish = () => {},
    } = props;
    const { timeline } = context;
    getTotalFrame(this.totalFrame);
    if (maxTimeAnimation) {
      maxTimeAnimation.onframe = (d) => getFrame(d.currentTime);
      maxTimeAnimation.onfinish = (d) => onfinish(d.currentTime);
    }
    timeline.goTo(frame);
    timeline.setSpeed(speed);
    timeline.setPlayState(playState);
  }

  willMount(): void {
    this.context.timeline = new Timeline(this);
  }

  animationWillPlay() {
    const { animator, context } = this;
    // @ts-ignore
    const { timeline } = context;
    const { animations } = animator;
    timeline.add(animations);
    animator.animations = timeline.getAnimation();
    this.computedFrame();
    this.setPlayState();
  }

  computedFrame() {
    const { animator } = this;
    this.totalFrame = 0;
    animator.animations.map((d) => {
      if (d.totalDuration > this.totalFrame) {
        this.totalFrame = d.totalDuration;
        this.maxTimeAnimation = d;
      }
    });
  }

  render() {
    return this.props.children;
  }
}

export default Player;

import { JSX } from './jsx/jsx-namespace';
import Component from './component';
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
   * 播放速率，默认为 1
   */
  // speed?: number;
  children?: JSX.Element | null;
}

class Player extends Component<PlayerProps> {
  private animations: IAnimation[];
  private setPlayState() {
    const { animator, props } = this;
    const { frame, state: playState } = props;

    if (frame) {
      animator.goTo(frame);
    }

    switch (playState) {
      case 'play':
        animator.play();
        break;
      case 'pause':
        animator.pause();
        break;
      case 'finish':
        animator.finish();
        break;
      default:
        break;
    }
  }

  animationWillPlay() {
    const { animator } = this;
    const { animations } = animator;
    // TODO: 这里需要优化
    // 因为 animator.run() 会重置 animations，到时上次的 animation 丢失，这里需要想个机制保留下来
    if (!this.animations) {
      this.animations = animations;
    }
    animator.animations = this.animations;
    this.setPlayState();
  }

  render() {
    return this.props.children;
  }
}

export default Player;

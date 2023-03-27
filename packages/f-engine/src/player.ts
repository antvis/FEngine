import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Control from './canvas/control';

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
  private setPlayState() {
    const { animator, props, context } = this;
    const { frame, state: playState } = props;
    const { timeline } = context;

    if (frame) {
      animator.goTo(frame);
    }

    switch (playState) {
      case 'play':
        timeline.setPlayState('play');
        animator.play();
        break;
      case 'pause':
        timeline.setPlayState('pause');
        animator.pause();
        break;
      case 'finish':
        timeline.setPlayState('finish');
        animator.finish();
        break;
      default:
        break;
    }
  }

  didMount(): void {
    this.context.timeline = new Control(this);
  }

  animationWillPlay() {
    const { animator, context } = this;
    // @ts-ignore
    const { timeline } = context;
    const { animations } = animator;
    timeline.add(animations);
    animator.animations = timeline.getAnimation();
    this.setPlayState();
  }

  render() {
    return this.props.children;
  }
}

export default Player;

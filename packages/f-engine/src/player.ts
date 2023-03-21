import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import { IAnimation } from '@antv/g-lite';
import Children from './children';
import { isArray } from '@antv/util';

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
  private playState: string = 'pause';
  private setPlayState() {
    const { animator, props } = this;
    const { frame, state: playState } = props;

    if (frame) {
      animator.goTo(frame);
    }

    switch (playState) {
      case 'play':
        this.playState = 'play';
        animator.play();
        break;
      case 'pause':
        this.playState = 'pause';
        animator.pause();
        break;
      case 'finish':
        this.playState = 'finish';
        animator.finish();
        break;
      default:
        break;
    }
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

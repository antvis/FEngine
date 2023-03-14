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
    const { animator, props } = this;
    // @ts-ignore
    const { timeline } = props;
    const { animations } = animator;
    timeline.addAnimation(animations);
    animator.animations = timeline.getAnimation();
    this.setPlayState();
  }

  render() {
    return this.props.children;
  }

  // isSameChildren(nextChildren, lastChildren) {
  //   return Children.compare(nextChildren, lastChildren, (next, last) => {
  //     if (!next && !last) return true;
  //     const { children, type } = next;
  //     const { children: lastChildNodes, type: lastType } = last;
  //     if (type !== lastType) return false;
  //     return this.isSameChildren(children, lastChildNodes);
  //   });
  // }
}

export default Player;

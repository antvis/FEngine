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
  private animations: IAnimation[];
  private shape;
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
    const { animator, children, shape } = this;
    const { animations } = animator;
    // TODO: 这里需要优化
    // 因为 animator.run() 会重置 animations，到时上次的 animation 丢失，这里需要想个机制保留下来
    if (!this.animations) {
      this.animations = animations;
    }

    if (shape) {
      if (!this.isSameChildren(children, shape)) {
        this.animations = animations;
      }
    } else {
      this.shape = children;
    }

    animator.animations = this.animations;
    this.setPlayState();
  }

  render() {
    return this.props.children;
  }

  isSameChildren(nextChildren, lastChildren) {
    return Children.compare(nextChildren, lastChildren, (next, last) => {
      if (!next && !last) return true;
      const { children, type } = next;
      const { children: lastChildNodes, type: lastType } = last;
      if (type !== lastType) return false;
      return this.isSameChildren(children, lastChildNodes);
    });
  }
}

export default Player;

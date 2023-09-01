import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Timeline from './canvas/timeline';
import { handerFrames, playerFrame } from './playerFrames';
import { IContext } from './types';

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

  keyFrames?: Record<string, playerFrame>[];
}

class Player extends Component<PlayerProps> {
  playerFrames;
  index: number;
  constructor(props) {
    super(props);
    const { keyFrames = [], children } = props;

    this.playerFrames = [
      this.props.children,
      ...keyFrames.map((cur) => {
        return handerFrames(cur, children);
      }),
    ];
    const count = this.playerFrames.length;

    this.state = {
      count,
      index: 0,
    };
  }

  private setPlayState() {
    const { props, context } = this;
    const { frame, state: playState } = props;
    const { timeline } = context;

    // timeline.goTo(frame);
    timeline.setPlayState(playState);
  }

  willMount(): void {
    this.context.timeline = new Timeline(this);
  }

  didMount(): void {
    const { animator } = this;
    animator.on('end', this.next);
  }

  willUpdate(): void {
    const { context, props } = this;
    const { state } = props;
    const { timeline } = context;

    this.playerFrames[0] = this.props.children;

    if (state === 'finish' && timeline.getPlayState() !== 'finish') {
      this.setState(({ count }) => ({
        index: count - 1,
      }));
    }

    if (state === 'play' && timeline.getPlayState() === 'finish') {
      this.setState(() => ({
        index: 0,
      }));
      timeline.reset();
    }
  }

  next = () => {
    const { index, count } = this.state;

    if (index < count - 1) {
      this.setState(() => ({
        index: index + 1,
      }));
    }
  };
  animationWillPlay() {
    const { animator, context } = this;
    // @ts-ignore
    const { timeline } = context;
    const { animations } = animator;
    timeline.add(animations);
    animator.animations = timeline.getAnimation();
    console.log(animator.animations);
    this.setPlayState();
  }

  render() {
    return this.playerFrames[this.state.index];
  }
}

export default Player;

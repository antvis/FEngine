import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Timeline from './canvas/timeline';
import { generateFrameElement, playerFrame } from './playerFrames';
import equal from './canvas/equal';
import { IContext } from './types';

// 播放状态
type playState = 'play' | 'pause' | 'finish';

export interface PlayerProps {
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
  /**
   * 协议动画播放结束
   */
  onend?: Function;
}

class Player extends Component<PlayerProps> {
  playerFrames;
  index: number;
  onend: Function;
  /**
  * 协议动画状态 play pause finish
  */
  isEnd: boolean;

  constructor(props) {
    super(props);
    const { keyFrames = [], children } = props;

    this.playerFrames = keyFrames.reduce((array, cur) => {
      const frames = generateFrameElement(cur, array[array.length - 1] || children);
      array.push(frames);
      return array;
    }, []);

    const count = this.playerFrames.length;

    this.state = {
      count,
      index: 0,
    };
  }

  private setPlayState() {
    const { props, context } = this;
    const { state: playState } = props;
    const { timeline } = context;

    timeline.setPlayState(playState);
  }

  willMount(): void {
    this.context.timeline = new Timeline(this);
  }

  didMount(): void {
    const { animator, props } = this;
    const { state } = props;
    animator.on('end', this.next);

    if (state === 'finish') {
      this.setState(({ count }) => ({
        index: count - 1,
      }));
    }
  }

  willUpdate(): void {
    const { context, props } = this;
    const { state } = props;
    const { timeline } = context;

    if (state === 'finish' && timeline.getPlayState() !== 'finish') {
      this.setState(({ count }) => ({
        index: count - 1,
      }));
    }
  }

  willReceiveProps(_nextProps: PlayerProps, _context?: IContext): void {
    if (!equal(_nextProps, this.props)) {
      this.playerFrames = _nextProps?.keyFrames.reduce((array, cur) => {
        const frames = generateFrameElement(cur, array[array.length - 1] || _nextProps?.children);
        array.push(frames);
        return array;
      }, []);
    }
  }

  next = () => {
    const { index, count } = this.state;
    const { onend = () => { }, state } = this.props;
    // @ts-ignore
    const { timeline } = this.context;
    timeline.clear();

    if (this.isEnd) return
    if (index < count - 1 && state === 'play') {
      this.setState(() => ({
        index: index + 1,
      }));
    } else {
      onend();
      this.isEnd = true
    }
  };

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
    return this.playerFrames[this.state.index];
  }
}

export default Player;

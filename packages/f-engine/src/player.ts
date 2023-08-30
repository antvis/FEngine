import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Timeline from './canvas/timeline';
import { isArray } from '@antv/util';
import { handerFrames, playerFrame } from './playerFrames';
// import { updateComponents } from './canvas/render';

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

    this.playerFrames = keyFrames.map((cur) => {
      return handerFrames(cur, children);
    });
    // const count = this.playerFrames.length;

    // (this.state = {
    //   // count,
    //   index: 0,
    // });
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
    const { timeline, root } = this.context;

    setTimeout(() => {
      this.playerFrames.map((d, index) => {
        this.render = () => {
          return d;
        };
        timeline.setFrame(index);
        root.updateComponents([this]);
      });

      timeline.goTo({ index: 1, frame: 4999 });

      timeline.playTimeline();
    }, 0);
  }

  didMount() {
    const { props, context } = this;
    const { timeline, root } = context;
    const { state: playState } = props;
  }

  willUpdate(): void {
    const { props, context } = this;
    const { timeline } = context;
    const { state: playState } = props;
  }

  didUpdate(): void {
    const { props, context } = this;
    const { timeline } = context;
    const { state: playState } = props;
  }

  next = () => {
    const { index, count } = this.state;
    // if (index < count - 1) {
    this.setState(() => ({
      index: index + 1,
    }));
    // }
  };

  animationWillPlay() {
    // TODO: 进来多次
    const { animator, context } = this;
    // @ts-ignore
    const { timeline } = context;
    const { animations } = animator;

    timeline.add(animations);
    timeline.addAnimators(animator);
    animator.animations = timeline.getAnimation();
    timeline.setPlayState('pause');
  }

  render() {
    console.log('render');
    return this.props.children;
  }
}

export default Player;

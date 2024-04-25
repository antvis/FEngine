import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Timeline from './canvas/timeline';
import { generateFrameElement, playerFrame } from './playerFrames';
import { getUpdateAnimation } from './canvas/render/index'
import Children from './children';
import { IContext } from './types';
import { VNode } from './canvas/vnode';
import { isEqual } from '@antv/util';

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
  /**
   * 时间
   */
  goTo?: number
}

function cloneNode(vnode) {
  return Children.map(vnode, (child) => {
    if (!child) {
      return;
    }
    const { shape, children } = child
    return {
      ...child,
      shape: shape.cloneNode(),
      children: cloneNode(children)
    }
  });
}

class Player extends Component<PlayerProps> {
  playerFrames;
  timeline;
  index: number;
  onend: Function;
  preNode: VNode;
  /**
  * 内部播放真实状态 play pause finish
  */
  playState;

  constructor(props) {
    super(props);
  }

  didMount(): void {
    const { keyFrames, children, state, onend, goTo } = this.props

    this.playerFrames = keyFrames.reduce((array, cur) => {
      const frames = generateFrameElement(cur, array[array.length - 1] || children);
      array.push(frames);
      return array
    }, []);

    this.preNode = cloneNode(this._vNode)
    const array = this.playerFrames.map((cur, index) => {
      const keyFrame = keyFrames[index];
      const childrenAnimation = getUpdateAnimation(this, cur, keyFrame);
      this.preNode = cloneNode(this.preNode)
      return {
        childrenAnimation,
        totalTime: 0
      }
    });

    this.timeline = new Timeline({
      animators: array,
      playState: state,
      root: this.context.canvas
    });

    this.timeline.start()
    onend && this.timeline.on('end', onend);
    goTo && this.goTo(goTo)
  }

  willReceiveProps(nextProps: PlayerProps, _context?: IContext) {
    const { props: lastProps, timeline } = this;
    const { state, goTo: nextTime } = nextProps;
    const { goTo } = lastProps

    // state 更新
    if (!isEqual(state, timeline.getPlayerState())) {
      timeline.updateState({ state })
    }

    if (!isEqual(nextTime, goTo)) {
      this.goTo(nextTime)
    }
  }

  goTo(time) {
    const { timeline } = this;
    timeline.goTo(time)
  }

  render() {
    return null
  }
}

export default Player;

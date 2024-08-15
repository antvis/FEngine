import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Timeline from './canvas/timeline';
import { generateFrameElement, playerFrame } from './playerFrames';
import { getUpdateAnimation } from './canvas/render/index';
import Children from './children';
import { IContext } from './types';
import { VNode } from './canvas/vnode';
import { isEqual } from '@antv/util';
import applyStyle from './canvas/render/applyStyle';

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
  speed?: number;
  children?: JSX.Element | null;

  keyFrames?: Record<string, playerFrame>[];
  /**
   * 协议动画播放结束
   */
  onend?: Function;
  /**
   * 时间
   */
  goTo?: number;
}

function cloneNode(vnode) {
  return Children.map(vnode, (child) => {
    if (!child) {
      return;
    }
    const { shape, children, animator } = child;
    const { end = {} } = animator;

    // 拿到上一帧的snapshot
    const snapshot = shape.cloneNode();
    applyStyle(snapshot, end);

    return {
      ...child,
      shape: snapshot,
      children: cloneNode(children),
    };
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
    const { keyFrames, children, state, onend, goTo, speed } = this.props;

    this.playerFrames = keyFrames.reduce((array, cur) => {
      const frames = generateFrameElement(cur, array[array.length - 1] || children);
      array.push(frames);
      return array;
    }, []);

    const array = this.playerFrames.map((cur, index) => {
      const keyFrame = keyFrames[index];
      this.preNode = cloneNode(this.preNode || this._vNode);
      const animUnits = getUpdateAnimation(this, cur, keyFrame) || {};

      return animUnits;
    });

    this.timeline = new Timeline({
      animUnits: array,
      playState: state,
      root: this.context.canvas,
      speed: speed,
      time: goTo,
    });

    this.timeline.start();
    onend && this.timeline.on('end', onend);
  }

  willReceiveProps(nextProps: PlayerProps, _context?: IContext) {
    const { props: lastProps, timeline } = this;
    const { state, goTo: nextTime, speed: newSpeed } = nextProps;
    const { goTo: lastTime, speed: lastSpeed } = lastProps;

    if (!isEqual(state, timeline.getPlayState()) && timeline.getPlayState() === 'finish') {
      // 重播
      if (nextTime < timeline.totalDuration) {
        timeline.updateState(state);
        timeline.goTo(nextTime);
      }
      //保持结束播放状态
      return;
    }

    // state 更新
    if (!isEqual(state, timeline.getPlayState())) {
      timeline.updateState(state);
    }

    if (!isEqual(nextTime, lastTime)) {
      timeline.goTo(nextTime);
    }

    // 播放速度
    if (!isEqual(newSpeed, lastSpeed)) {
      timeline.setPlaybackRate(newSpeed);
    }
  }

  /*外部ref调用方式 */
  setPlayState(state) {
    const { timeline } = this;

    timeline.updateState(state);
  }

  goTo(time) {
    const { timeline } = this;
    timeline.goTo(time);
  }

  setPlaybackRate(speed) {
    const { timeline } = this;
    timeline.setPlaybackRate(speed);
  }

  render() {
    return null;
  }
}

export default Player;

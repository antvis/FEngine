import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Children from './children';
import { isNumber } from '@antv/util';

export interface TimelineProps {
  /**
   * @title 起始索引
   * @description 开始的组件索引
   */
  start?: number;
  /**
   * @title 延迟(ms)
   * @description 组件播放的延迟时间
   */
  delay?: number;
  /**
   * @title 自动循环
   * @description 是否自动循环
   */
  loop?: boolean;
  /**
   * @ignore
   * 自动播放
   */
  autoPlay?: boolean;
  /**
   * @ignore
   * 子组件
   */
  children?: any;
}

class Timeline extends Component<TimelineProps> {
  index: number;
  delay: number;

  private timer: any;

  constructor(props: TimelineProps) {
    super(props);
    const { delay, start = 0, children, autoPlay } = props;
    const count = Children.toArray(children as JSX.Element).length;

    this.state = {
      delay,
      count,
      index: start,
      autoPlay,
    };
  }

  didMount() {
    this.animator.on('end', this.next);
  }

  willReceiveProps(nextProps: TimelineProps): void {
    const { start: nextStart, delay: nextDelay, autoPlay: nextAutoPlay } = nextProps;
    const { index, delay, autoPlay } = this.state;

    if (isNumber(nextStart) || nextDelay !== delay || nextAutoPlay !== autoPlay) {
      // 更新时清除 setTimeout
      clearTimeout(this.timer);
      this.setState({
        delay: nextDelay,
        index: isNumber(nextStart) ? nextStart : index,
        autoPlay: nextAutoPlay,
      });
    }
  }

  didUnmount(): void {
    this.animator.off('end', this.next);
  }

  next = () => {
    const { state, props } = this;
    const { index, count, delay, autoPlay } = state;
    const { loop } = props;

    if (autoPlay === false) {
      return;
    }
    const next = loop ? (index + 1) % count : index + 1;
    if (next >= count) {
      return;
    }
    this.timer = setTimeout(() => {
      this.setState({
        index: next,
      });
    }, delay || 0);
  };

  render() {
    const { state, props } = this;
    const { children } = props;
    const { index } = state;
    const childrenArray = Children.toArray<JSX.Element>(children);
    return childrenArray[index];
  }
}

export default Timeline;

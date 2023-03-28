import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Children from './children';

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

  constructor(props: TimelineProps) {
    super(props);
    const { delay, start = 0, children } = props;
    const count = Children.toArray(children as JSX.Element).length;

    this.state = {
      delay,
      count,
      index: start,
    };
  }

  didMount() {
    const { autoPlay = true } = this.props;
    if (autoPlay) {
      this.animator.on('end', this.next);
    }
  }

  didUnmount(): void {
    this.animator.off('end', this.next);
  }

  next = () => {
    const { state, props } = this;
    const { index, count, delay } = state;
    const { loop, autoPlay = true } = props;

    const next = loop ? (index + 1) % count : index + 1;

    if (next < count && autoPlay) {
      setTimeout(() => {
        this.setState({
          index: next,
        });
      }, delay || 0);
    }
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

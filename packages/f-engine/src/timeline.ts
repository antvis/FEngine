import { JSX } from './jsx/jsx-namespace';
import Component from './component';
import Children from './children';

export interface TimelineProps {
  /**
   * 开始的组件索引
   */
  start?: number;
  /**
   * 组件播放的延迟时间
   */
  delay?: number;
  /**
   * 是否自动循环
   */
  loop?: boolean;
  /**
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
    this.animator.on('end', this.next);
  }

  didUnmount(): void {
    this.animator.off('end', this.next);
  }

  next = () => {
    const { state, props } = this;
    const { index, count, delay } = state;
    const { loop } = props;

    const next = loop ? (index + 1) % count : index + 1;
    if (next < count) {
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
    const childrenArray = Children.toArray(children as JSX.Element);
    return childrenArray[index];
  }
}

export default Timeline;

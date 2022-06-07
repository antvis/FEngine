import { jsx, Children } from '../src';

describe('compare', () => {
  it('compare Array', () => {
    const lastElement = (
      <group>
        <rect id={1} />
        <rect key="a" id={2} />
      </group>
    );
    const nextElement = (
      <group>
        <rect key="a" id={3} />
        <rect id={4} />
      </group>
    );

    const callback = jest.fn();

    Children.compare(nextElement.props.children, lastElement.props.children, callback);

    expect(callback.mock.calls.length).toBe(3);

    // key 相同 update
    expect(callback.mock.calls[0][0]).toEqual({
      key: 'a',
      props: { id: 3 },
      ref: undefined,
      type: 'rect',
    });
    expect(callback.mock.calls[0][1]).toEqual({
      key: 'a',
      props: { id: 2 },
      ref: undefined,
      type: 'rect',
    });

    // 第二元素已经被处理过了
    expect(callback.mock.calls[1][0]).toEqual({
      key: undefined,
      props: { id: 4 },
      ref: undefined,
      type: 'rect',
    });
    expect(callback.mock.calls[1][1]).toEqual(null);

    // lastElement 还有一个元素未被处理
    expect(callback.mock.calls[2][0]).toEqual(null);
    expect(callback.mock.calls[2][1]).toEqual({
      key: undefined,
      props: { id: 1 },
      ref: undefined,
      type: 'rect',
    });
  });
});

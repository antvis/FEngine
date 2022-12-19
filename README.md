FEngine 是 AntV F 系列可视化引擎的底层渲染引擎，为移动端提供了一套完整的渲染、事件、动画能力，能方便的构建可视化 UI

## 快速开始

```jsx
const { props } = (
  <Canvas context={context}>
    <rect style={{ width: 10, height: 10, fill: 'red' }} />
  </Canvas>
);

const canvas = new Canvas(props);
await canvas.render();
```

## 本地开发

```bash
# 安装依赖 (推荐用 yarn)
$ yarn

# 通过单测调试
$ npm run test-watch 'packages/f-engine/test/canvas/index.test.tsx'

```

## License

[MIT license](./LICENSE).

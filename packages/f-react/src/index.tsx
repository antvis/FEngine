import { Canvas } from '@antv/f-engine';
import { createCanvas, CanvasProps } from './createCanvas';

export { createCanvas, CanvasProps };
// 通过工厂模式创建时为了让 f2-react 依赖 f2 的 canvas 而不是 f-engine
export default createCanvas(Canvas);

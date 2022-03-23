import { createContext, delay, dispatchEvent } from '../util';
import { CanvasAdapter, CanvasRender } from '../../src';
import { createCanvasAdapterInstance } from './util';
import { AdapterEvent } from '../../src/adapter/event';

function simulateTouchEvent(dom, type, cfg) {
  // esingnore
  const event = new TouchEvent(type, cfg);
  dom.dispatchEvent(event);
}
function getClientPoint(canvas, x, y) {
  const point = canvas.getClientByPoint(x, y);
  return {
    clientX: point.x,
    clientY: point.y,
  };
}
describe('test canvasAdapter', () => {
  const { context, canvas, renderer } = createCanvasAdapterInstance();

  it('init', () => {
    expect(canvas.get('width')).toEqual(500);
    expect(canvas.get('el').width).toEqual(1000);
    expect(canvas.get('capture')).toEqual(true);
    expect(canvas.getChildren().length).toEqual(0);
    expect(canvas.getRenderer()).toEqual(renderer);
  });

  it('add group', () => {
    const group = canvas.addGroup();
    expect(group.get('visible')).toEqual(true);
    expect(canvas.getChildren().length).toEqual(1);
  });

  it('add shape', () => {
    const circle = canvas.addShape({
      type: 'circle',
      attrs: {
        x: 10,
        y: 10,
        r: 10,
        fill: 'red',
      },
    });
    expect(circle.get('type')).toEqual('circle');
    expect(circle.attr('r')).toEqual(10);
  });

  it('clear', () => {
    canvas.clear();
    expect(canvas.getChildren().length).toEqual(0);
  });

  it('changeSize', () => {
    canvas.changeSize(800, 800);
    expect(canvas.get('el').width).toEqual(1600);
    expect(canvas.get('el').height).toEqual(1600);
  });

  it('event', (done) => {
    const circle = canvas.addShape({
      type: 'circle',
      attrs: {
        x: 10,
        y: 10,
        r: 10,
        fill: 'red',
      },
    });
    Object.values(AdapterEvent).forEach((eventType) => {
      canvas.on(eventType, (ev) => {
        console.log(`trigger:  ${eventType} - ${ev.type}`);
      });
    });

    circle.on(AdapterEvent.drag, ({ target, x, y }) => {
      target.attr({ x, y });
    });

    // 暂时模拟事件派发不生效
    const { clientX, clientY } = getClientPoint(canvas, 5, 5);
    dispatchEvent(canvas.get('el'), 'touchstart', {
      pointerType: 'touch',
      clientX,
      clientY,
    });
    done();
  });

  it('destroy', () => {
    canvas.destroy();
    expect(canvas.destroyed).toEqual(true);
  });
});

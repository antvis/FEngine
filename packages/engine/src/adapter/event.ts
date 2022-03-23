import Hammer from '../canvas/event/index';
import EE from 'eventemitter3';
import { ADAPTER_ELE_PROPER_NAME } from './utils';

const HammerEvent = {
  click: 'click',
  dbclick: 'dbclick',
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',
  touchendoutside: 'touchendoutside',
  panstart: 'panstart',
  pan: 'pan',
  panend: 'panend',
  press: 'press',
  swipe: 'swipe',
};

export const AdapterEvent = {
  '*': '*',
  click: 'click',
  dbclick: 'dbclick',
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',
  touchendoutside: 'touchendoutside',
  panstart: 'panstart',
  panmove: 'panmove',
  panend: 'panend',
  press: 'press',
  swipe: 'swipe',
  dragstart: 'dragstart',
  drag: 'drag',
  dragend: 'dragend',
  tap: 'tap',
};

function transformEventTarget(event) {
  return {
    x: event.x,
    y: event.y,
    clientX: event.clientX,
    clientY: event.clientY,
    canvasX: event.canvasX,
    canvasY: event.canvasY,
    tiltX: event.tiltX,
    tiltY: event.tiltY,
    offsetX: event.offsetX,
    offsetY: event.offsetY,
    pageX: event.pageX,
    pageY: event.pageY,
    screenX: event.screenX,
    screenY: event.screenY,
    target: event.target?.[ADAPTER_ELE_PROPER_NAME],
    currentTarget: event.currentTarget?.[ADAPTER_ELE_PROPER_NAME],
    propagationPath: event.propagationPath?.map((ele) => ele[ADAPTER_ELE_PROPER_NAME]),
    stopPropagation: (is) => event.stopPropagation(is),
    preventDefault: () => event.preventDefault(),
    stopImmediatePropagation: () => event.stopImmediatePropagation(),
  };
}

const DRAG_OFFSET = 40;
const DRAG_TIME = 120;

function getEventTarget(e, type, target) {
  return {
    ...e,
    type: type,
    name: type,
    target,
  };
}

export class AdapterHammer extends EE {
  hammer = null;
  isDraging = false;
  panStartTime = null;
  startX = 0;
  startY = 0;
  DRAG_OFFSET = 40;
  dragShape = null;
  DRAG_TIME = 120;

  constructor(ele) {
    super();
    this.hammer = new Hammer(ele);
    Object.values(HammerEvent).forEach((eventType) => {
      this.hammer.on(eventType, (e) => {
        this.emitEvent(e, eventType);
      });
    });
  }

  emitEvent(evtObj, eventType) {
    let e = evtObj;
    const transformEvtObj = transformEventTarget(evtObj);
    const { target } = transformEvtObj;
    switch (eventType) {
      case HammerEvent.touchstart:
        e = getEventTarget(transformEvtObj, AdapterEvent.touchstart, target);
        this.emit(AdapterEvent.touchstart, e);

        e = getEventTarget(transformEvtObj, AdapterEvent.tap, target);
        this.emit(AdapterEvent.tap, e);
        break;
      case HammerEvent.pan:
        e = getEventTarget(transformEvtObj, AdapterEvent.panmove, target);
        this.emit(AdapterEvent.panmove, e);
        break;
      default:
        e = getEventTarget(transformEvtObj, eventType, target);
        this.emit(eventType, e);
    }
    this.emit(AdapterEvent['*'], e);

    const isDraggable = target && target.get('draggable');
    if (eventType === HammerEvent.panstart) {
      this.panStartTime = Date.now();
      this.startX = e.x;
      this.startY = e.y;
      this.dragShape = target;
    }

    if (eventType === HammerEvent.pan) {
      const moveX = e.x - this.startX;
      const moveY = e.y - this.startY;
      const distance = moveY * moveY + moveX * moveX;
      const timeWindow = Date.now() - this.panStartTime;
      if (this.isDraging) {
        e = getEventTarget(transformEvtObj, AdapterEvent.drag, this.dragShape);
        this.emit(AdapterEvent.drag, e);
      } else if ((isDraggable && distance > DRAG_OFFSET) || timeWindow > DRAG_TIME) {
        this.isDraging = true;
        e = getEventTarget(transformEvtObj, AdapterEvent.dragstart, this.dragShape);
        this.emit(AdapterEvent.dragstart, e);
      }
    }

    if (eventType === HammerEvent.panend && this.isDraging) {
      e = getEventTarget(transformEvtObj, AdapterEvent.dragend, this.dragShape);
      this.emit(AdapterEvent.dragend, e);
      this.emit(AdapterEvent['*'], e);
      this.panStartTime = -1;
      this.startX = 0;
      this.startY = 0;
      this.isDraging = false;
      this.dragShape = null;
    }
  }
}

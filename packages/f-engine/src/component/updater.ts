import Canvas from '../canvas';
import Component from '.';

export interface Updater<S = any> {
  enqueueSetState: (component: Component, partialState: S, callback?: () => void) => void;
  enqueueForceUpdate: (component: Component, partialState: S, callback?: () => void) => void;
}

function createUpdater(canvas: Canvas) {
  const setStateQueue = [];

  function process() {
    let item;

    const renderComponents = [];
    const renderCallbackQueue = [];

    while ((item = setStateQueue.shift())) {
      const { state, component, callback } = item;

      // 组件已销毁，不再触发 setState
      if (component.destroyed) {
        continue;
      }

      // 如果没有prevState，则将当前的state作为初始的prevState
      if (!component.prevState) {
        component.prevState = Object.assign({}, component.state);
      }

      // 如果stateChange是一个方法，也就是setState的第二种形式
      if (typeof state === 'function') {
        Object.assign(component.state, state(component.prevState, component.props));
      } else {
        // 如果stateChange是一个对象，则直接合并到setState中
        Object.assign(component.state, state);
      }

      component.prevState = component.state;

      if (typeof callback === 'function') {
        renderCallbackQueue.push({ callback, component });
      }

      if (renderComponents.indexOf(component) < 0) {
        renderComponents.push(component);
      }
    }

    canvas.updateComponents(renderComponents);

    // callback queue
    commitRenderQueue(renderCallbackQueue);
  }

  function enqueueSetState(component: Component, state, callback?: () => void) {
    if (setStateQueue.length === 0) {
      setTimeout(process, 0);
    }
    setStateQueue.push({
      component,
      state,
      callback,
    });
  }

  function commitRenderQueue(callbackQueue) {
    for (let i = 0; i < callbackQueue.length; i++) {
      const { callback, component } = callbackQueue[i];
      callback.call(component);
    }
  }

  const updater = {
    // isMounted: function(publicInstance) {
    //   return false;
    // },
    enqueueForceUpdate: enqueueSetState,
    // enqueueReplaceState: function(publicInstance, completeState) {
    // },
    enqueueSetState,
  };

  return updater;
}

export { createUpdater };

import { mix } from '@antv/util';

function createUpdater(canvas) {
  const setStateQueue = [];
  const renderQueue = [];
  const callbackQueue = [];

  function process() {
    let item;
    // let component;
    while ((item = setStateQueue.shift())) {
      const { state, component, callback } = item;

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
        callbackQueue.push({ callback, component });
      }
    }

    const renderComponents = [].concat(renderQueue);
    const renderCallbackQueue = [].concat(callbackQueue);

    // 先清空，renderComponents 里面有可能会继续 setState
    renderQueue.length = 0;
    callbackQueue.length = 0;

    canvas.renderComponents(renderComponents);

    // callback queue
    commitRenderQueue(renderCallbackQueue);
  }

  function enqueueSetState(component, state, callback?: () => void) {
    if (setStateQueue.length === 0) {
      setTimeout(process, 0);
    }
    setStateQueue.push({
      component,
      state,
      callback,
    });
    if (renderQueue.indexOf(component) < 0) {
      renderQueue.push(component);
    }
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

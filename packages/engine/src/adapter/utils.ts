export const ADAPTER_ELE_PROPER_NAME = '_ADAPTER_ELE_PROPER_NAME';

export function mix(...args) {
  function copy(target, source) {
    if ((typeof target !== 'object' && !Array.isArray(target)) || target === null) return target;
    if ((typeof source !== 'object' && !Array.isArray(source)) || source === null) return target;

    for (const [key, value] of Object.entries(source)) {
      if (value !== undefined && value !== null) target[key] = value;
    }
  }
  args.forEach((value, index) => {
    if (index === 0) return;
    copy(args[0], value);
  });
  return args[0];
}

export function isGroup(type) {
  return type === 'Group';
}

export default function createRef<T = any>() {
  const ref = {
    current: null as T,
  };
  return ref;
}

export default {
  cjs: {
    type: 'babel',
  },
  esm: {
    type: 'babel',
  },
  runtimeHelpers: true,
  lessInBabelMode: true,
  cssModules: true,
  extraBabelPlugins: ['@babel/plugin-proposal-class-static-block'],
  pkgs: ['engine', 'lottie', 'react', 'my', 'vue', 'wx'],
};

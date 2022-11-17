// 全局默认主题
export type Theme = Record<string, any>;

const THEME: Theme = {
  fontSize: '24px',
  fontFamily:
    '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
  pixelRatio: 1,
  padding: [0, 0, 0, 0],
};

// function setTheme(theme: Theme) {
//   Object.assign(THEME, theme);
// }

// function getTheme() {
//   return THEME;
// }

export default THEME;

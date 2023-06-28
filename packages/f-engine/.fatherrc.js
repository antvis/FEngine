export default process.env.CI && process.env.CI === 'true'
  ? {}
  : {
      umd: {
        name: 'FEngine',
        file: 'index',
        // minFile: true,
      },
      entry: ['src/index.ts', 'src/jsx/jsx-runtime.ts'],
      overridesByEntry: {
        'src/index.ts': {
          umd: { name: 'FEngine', file: 'index' },
        },
        // for weixin miniapp
        'src/jsx/jsx-runtime.ts': {
          umd: { name: 'FJSXRuntime', file: 'jsx-runtime' },
        },
      },
    };

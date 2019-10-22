const { NODE_ENV, ROLLUP } = process.env;

const targetNode = NODE_ENV === 'test';
const rollupCjsBuild = ROLLUP !== undefined;
const useESModules = !(rollupCjsBuild || targetNode);

module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        loose: true,
        targets: targetNode ? { node: true } : 'defaults'
      }
    ],
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react')
  ],
  plugins: [
    require.resolve('babel-plugin-graphql-tag'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    [require.resolve('@babel/plugin-transform-runtime'), { useESModules }],
    [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose: true }],
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@loadable/babel-plugin'),
    ...(targetNode
      ? [
          require.resolve('babel-plugin-dynamic-import-node'),
          [require.resolve('@babel/plugin-transform-modules-commonjs'), { loose: true }],
          require.resolve('@babel/plugin-transform-react-jsx-source')
        ]
      : [require.resolve('babel-plugin-annotate-pure-calls')])
  ].filter(Boolean)
};

const { NODE_ENV, ROLLUP } = process.env;

const targetTest = NODE_ENV === 'test';
const rollupCjsBuild = ROLLUP !== undefined;
const targetNode = rollupCjsBuild || targetTest;
const useESModules = !(rollupCjsBuild || targetTest);

// TODO: think one more time on this configuration! which is: if rollup build (cjs) then compile for node

module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        loose: true,
        targets: targetNode ? { node: '8' } : 'defaults'
      }
    ],
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react')
  ],

  plugins: [
    require.resolve('babel-plugin-graphql-tag'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose: true, useBuiltIns: true }],
    targetTest && [require.resolve('@babel/plugin-transform-modules-commonjs'), { loose: true }],
    ...(targetNode
      ? [
          require.resolve('babel-plugin-dynamic-import-node'),
          require.resolve('@babel/plugin-transform-react-jsx-source')
        ]
      : [
          require.resolve('babel-plugin-annotate-pure-calls'),
          [require.resolve('@babel/plugin-transform-runtime'), { useESModules }]
        ])
  ].filter(Boolean)
};

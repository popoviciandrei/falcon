const { NODE_ENV, ROLLUP } = process.env;

const targetNode = NODE_ENV === 'test';
const rollupCjsBuild = ROLLUP !== undefined;
const useESModules = !(rollupCjsBuild || targetNode);

// TODO: think one more time on this configuration! which is: if rollup build (cjs) then compile for node

module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        loose: true,
        targets: rollupCjsBuild || targetNode ? { node: true } : 'defaults'
      }
    ],
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react')
  ],

  plugins: [
    require.resolve('babel-plugin-graphql-tag'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose: true, useBuiltIns: true }],
    targetNode && [require.resolve('@babel/plugin-transform-modules-commonjs'), { loose: true }],
    ...(targetNode || rollupCjsBuild
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

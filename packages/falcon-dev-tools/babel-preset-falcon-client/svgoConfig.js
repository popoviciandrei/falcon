/**
 * because `babel-plugin-inline-react-svg` overrides defaults,
 * we take them from official `svgo` docs https://github.com/svg/svgo/blob/master/README.md
 */
const svgoConfig = {
  plugins: [
    { cleanupIDs: true },
    { removeTitle: true },
    { removeDoctype: true },
    { removeComments: true },
    { cleanupAttrs: true },
    { inlineStyles: true },
    { removeXMLProcInst: true },
    { removeMetadata: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeHiddenElems: true },
    { removeEmptyText: true },
    { removeEmptyContainers: true },
    { minifyStyles: true },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: true },
    { removeUselessStrokeAndFill: true },
    { removeUnusedNS: true },
    { cleanupNumericValues: true },
    { sortDefsChildren: true },
    { removeAttrs: { attrs: '(data-name)' } }
  ]
};

module.export = svgoConfig;

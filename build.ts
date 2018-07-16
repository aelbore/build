import { buildCopyPackageFile, rollupBuild, createRollupConfig, clean } from '@ngx-devtools/common';

const PKG_NAME = 'build';

Promise.all([ clean('dist') ]).then(() => {
  return Promise.all([ 
    buildCopyPackageFile(PKG_NAME),  
    rollupBuild(createRollupConfig({ input: `src/${PKG_NAME}.ts`, file: `dist/${PKG_NAME}.js`, format: 'cjs' }))
  ])
});
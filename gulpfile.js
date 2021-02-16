const { src, dest, series, parallel } = require('gulp');
const { buildConfig } = require('./rollup.config.js');
const rollup = require('rollup');
const zip = require('gulp-zip');

const functions = [
  'connect',
  'disconnect',
  'getMessages',
  'sendMessage',
  'deleteMessage',
  'manageBlockedUsers',
];

const bundleTasks = functions.map((entryPoint) => {
  return async () => {
    const bundle = await rollup.rollup({
      input: `src/${entryPoint}.ts`,
      ...buildConfig,
    });
    await bundle.write({
      file: `dist/${entryPoint}.js`,
      format: 'commonjs',
    });
  };
});

const zipTasks = functions.map((entryPoint) => {
  return () =>
    src(`dist/${entryPoint}.js`)
      .pipe(zip(`${entryPoint}.zip`))
      .pipe(dest('dist/packages'));
});

const bundle = parallel(...bundleTasks);
const package = series(bundle, parallel(...zipTasks));

module.exports = {
  bundle,
  package,
  default: package,
};

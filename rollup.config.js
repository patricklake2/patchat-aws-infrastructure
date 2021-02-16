const babel = require('rollup-plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const builtins = require('builtin-modules');

exports.buildConfig = {
  external: [
    ...builtins,
    'aws-sdk/clients/dynamodb',
    'aws-sdk/clients/apigatewaymanagementapi',
    'aws-sdk/clients/s3'
  ],
  plugins: [
    resolve({
      preferBuiltIns: true,
    }),
    typescript(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

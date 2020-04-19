const merge = require('webpack-merge')

const baseConf = require('./webpack.config.js');

module.exports = merge(baseConf, {
  mode: 'development',
  watch: true
});
const baseConfig = require('./webpack.base.config.js')

baseConfig.target = 'electron-preload'
baseConfig.entry = {
    preload: './src/preload.ts',
}
baseConfig.output.chunkFormat = 'commonjs'
baseConfig.output.libraryTarget = 'commonjs2'
module.exports = baseConfig
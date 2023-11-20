const baseConfig = require('./webpack.base.config.js')

baseConfig.target = 'electron-main'
baseConfig.entry = {
    main: './src/main/main.ts',
    // preload: './src/preload.ts',
}
baseConfig.output.libraryTarget = 'commonjs2'
baseConfig.output.chunkFormat = 'commonjs'

module.exports = baseConfig
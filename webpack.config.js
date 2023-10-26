const path = require('path');

module.exports = {
    target: 'node',
    entry: './src/renderer.ts', // 入口文件路径
    output: { // 输出文件配置
        path: path.resolve(__dirname, 'dist'), // 输出目录路径
        filename: 'bundle.js' // 输出文件名
    },
    module: { // 模块配置
        rules: [ // 模块规则
            {
                test: /\.js$/, // 匹配.js文件
                exclude: /node_modules/, // 排除node_modules目录
                use: { // 使用的loader
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts$/, // 匹配.ts文件
                exclude: /node_modules/, // 排除node_modules目录
                use: { // 使用的loader
                    loader: 'ts-loader'
                }
            }
        ]
    }
}
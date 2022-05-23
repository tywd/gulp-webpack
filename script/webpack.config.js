/*
 * @Author: tywd
 * @Date: 2022-05-22 23:16:11
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-23 19:42:50
 * @FilePath: /gulp4-webpack/script/webpack.config.js
 * @Description: Do not edit
 */
console.log('利用了 webpack-stream ！！！')
const path = require('path')
const config = require('./config')
const {
    VueLoaderPlugin
} = require('vue-loader');

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    // entry: {
    //     index: path.resolve(__dirname, '../project/tywd/js/index.js'),
    // },
    // output: {
    //     filename: '[name].js',
    //     path: path.resolve(__dirname, '../dist/tywd/js'),
    //     publicPath: '/js/'
    // },
    module: {
        rules: [
            // {
            //     test: /\.m?js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env'],
            //             plugins: ['@babel/plugin-proposal-object-rest-spread',
            //                 '@babel/plugin-transform-runtime'
            //             ],
            //             cacheDirectory: true,
            //         }
            //     }
            // }, 
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'preprocess-loader',
                    options: {
                        // 填写变量
                        ...config,
                        ppOptions: {
                            type: 'js'
                        }
                    }
                }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        alias: {
            // '$vue': 'vue/dist/vue.js', // 配置 vue 的引用 并重命名
            // '$vue': 'vue/dist/vue.esm.js',// esm标准。
            '$vue': 'vue/dist/vue.min.js', // min压缩版
            '@': path.resolve("./"),
        }
    }
}
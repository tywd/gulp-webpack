/*
 * @Author: tywd
 * @Date: 2022-05-22 23:16:11
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-23 00:23:29
 * @FilePath: /gulp4-webpack/script/webpack.config.js
 * @Description: Do not edit
 */
console.log('利用了 webpack ！！！')

const path = require('path')
const config = require('./config')

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
        }]
    },
}
/*
 * @Author: tywd
 * @Date: 2022-05-22 01:26:28
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-22 22:08:51
 * @FilePath: /gulp4-webpack/gulpfile.js
 * @Description: Do not edit
 */
/*
// 公有任务
function publicTask(cb) {
    console.log('公有任务')
    cb()
}
// 私有任务
function privateTask(cb) {
    console.log('私有任务')
    cb()
}
exports.default = privateTask
exports.publicTask = publicTask
// series 串行任务
// parallel 并行任务
// 串行任务与并行任务的任意组合 exports.default = series(privateTask, publicTask, parallel(privateTask, series(publicTask))) */

const gulp = require('gulp'); //gulp插件
const requireDir = require('require-dir');
const all = requireDir('./script/gulp_task', { recurse: true }); // 合并tasks

// cb 回调函数的作用是在task完成时通知Gulp（而不是返回一个流），而task里的所有其他功能都纯粹依赖Node来实现。 或者使用 async & await
const help = (cb)=>{
    console.log('	gulp init  --name $project			创建一个项目');
    console.log('	gulp serve --name $project			以指定目录（项目）打开开发服务');
    console.log('	gulp build --name $project			以指定目录（项目）打包');
    cb()
}

// const help = async (cb)=>{
//     console.log('	gulp init  --name $project			创建一个项目');
//     console.log('	gulp serve --name $project			以指定目录（项目）打开开发服务');
//     await console.log('	gulp build --name $project			以指定目录（项目）打包');
// }

exports.help = help
exports.init = all.init
exports.serve = all.serve
exports.build = all.build
/*
 * @Author: tywd
 * @Date: 2022-05-22 11:30:33
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-22 11:54:55
 * @FilePath: /gulp4-webpack/script/gulp_task/init.js
 * @Description: 初始化一个项目
 */
const gulp = require('gulp')
const minimist = require('minimist')
const fs = require('fs');

let knownOptions = {
    string: ['name'],
    default: {
        name: ''
    }
};

let args = minimist(process.argv.slice(2), knownOptions);

const init = () => {
    if (args.name == '') {
        log('needs project name! please gulp init --name ${project}');
        return;
    }
    let path = './project/' + args.name;

    if (fs.existsSync(path)) {
        log('the project name is existing!');
        return;
    }

    return gulp.src('./script/_template/**/*')
        .pipe(gulp.dest(path))

};

function log(text) {
    console.log(text)
}

module.exports = init
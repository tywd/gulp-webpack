/*
 * @Author: tywd
 * @Date: 2022-05-22 16:21:02
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-22 22:39:42
 * @FilePath: /gulp4-webpack/script/gulp_task/build.js
 * @Description: Do not edit
 */
const gulp = require('gulp')
const path = require('path')
const fse = require('fs-extra')
const del = require('del') // del 插件和 gulp 的 watch 来实现自动删除文件功能。
const minimist = require('minimist') // 用于获取 shell 命令
const changed = require('gulp-changed') // changed 是一个只让更改过的文件通过管道的插件，它可以防止没有更改过的文件重复编译，以此提高效率。
const sass = require('gulp-sass')(require('sass')) // 使用 sass 编译器
const fileinclude = require('gulp-file-include') // 将指定的 html 文件的代码复制到一个 html 文件上
const plumber = require('gulp-plumber') // 一个可以防止编译出错导致进程退出的插件，如果程序出错，它会将异常抛到终端上，并且防止进程退出。
const htmlmin = require('gulp-htmlmin') // html压缩
const uglify = require('gulp-uglify') // 一个用于压缩 js 的插件，下面我们安装这个插件来压缩 js
const autoPrefixer = require('gulp-autoprefixer'); // css 浏览器样式前缀
const cleanCss = require('gulp-clean-css') // 压缩 css 的插件，scss一样有效
const sourcemaps = require('gulp-sourcemaps'); // 一个信息文件，里面存储了代码打包转换后的位置信息，实质是一个 json 描述文件，维护了打包前后的代码映射关系，报错时可以成功定位到具体的报错位置
const imagemin = require('gulp-imagemin') // 压缩图片的插件 cnpm安装，npm安装有报错

let knownOptions = {
    string: ['name'],
    default: {
        name: ''
    }
};
let args = minimist(process.argv.slice(2), knownOptions);
const runProject = 'project/' + args.name
const buildProject = 'dist/' + args.name

// html处理
const html = () => {
    // **/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js
    return gulp.src([runProject + '/**/*.html', `!(${runProject} + '/components/**/*.html)'`]) // 处理 src 目录里的所有 html 文件，但是不处理 src/components 里的 html 文件,  components 文件夹里的文件就是 “组件”，用来被引入到 html 去。
        // return gulp.src([runProject + '/**/*.html'])
        .pipe(changed(runProject + '/**/'))
        .pipe(fileinclude({
            prefix: '@@', // 引用符号
            basepath: runProject + '/components' // 引用文件路径
        }))
        .pipe(plumber())
        .pipe(htmlmin({
            removeComments: true, // 清除HTML注释
            collapseWhitespace: true, // 压缩HTML
            collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
            minifyJS: true, // 压缩页面JS
            minifyCSS: true // 压缩页面CSS
        }))
        .pipe(gulp.dest(buildProject))
}

// scss处理
const scss = () => {
    return gulp.src([runProject + '/css/**/*.scss'])
        .pipe(changed(runProject + '/css/**/'))
        .pipe(sass.sync({
            outputStyle: 'compressed', //nested, expanded, compact, compressed,默认nested
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoPrefixer({
            browsers: [
                "> 1%",
                "last 2 versions",
                "iOS >= 7",
                "Android > 4.1",
                "Firefox ESR"
            ]
        })) //自动添加浏览器样式前缀
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(plumber())
        .pipe(gulp.dest(buildProject + '/css'))
}

// 图片处理
const images = () => {
    return gulp.src([runProject + '/images/**/*.{png,jpg,gif,jpeg,ico}']) //后缀都用小写，不然不识别
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(buildProject + '/images'))
}

// js处理
const js = () => {
    return gulp.src([runProject + '/js/**/*.js'])
        .pipe(changed(runProject + '/js/**/'))
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(buildProject + '/js'))
}

const clean = () => {
    return del('dist/' + args.name)
}

const build = (cb) => {
    if (args.name == '') {
        log('needs project name! please gulp build --name ${project}');
        return;
    }
    gulp.series(clean, html, scss, images, js)()
    cb()
}

function log(text) {
    console.log(text)
}

module.exports = build
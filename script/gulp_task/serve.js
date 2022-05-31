/*
 * @Author: tywd
 * @Date: 2022-05-22 11:42:17
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-31 22:06:56
 * @FilePath: /gulp4-webpack/script/gulp_task/serve.js
 * @Description: Do not edit
 */
const gulp = require('gulp')
const path = require('path')
const fse = require('fs-extra')
const del = require('del') // del 插件和 gulp 的 watch 来实现自动删除文件功能。
const minimist = require('minimist') // 用于获取 shell 命令
const webserver = require('gulp-webserver') // 一个本地服务器，具有热替换、代理等功能，使用它可以更快捷开发程序 
const changed = require('gulp-changed') // changed 是一个只让更改过的文件通过管道的插件，它可以防止没有更改过的文件重复编译，以此提高效率。
const sass = require('gulp-sass')(require('sass')) // 使用 sass 编译器
const fileinclude = require('gulp-file-include') // 将指定的 html 文件的代码复制到一个 html 文件上
const fileMiddleware = require('./lib/file-middleware');
const plumber = require('gulp-plumber') // 一个可以防止编译出错导致进程退出的插件，如果程序出错，它会将异常抛到终端上，并且防止进程退出。
const autoPrefixer = require('gulp-autoprefixer'); // css 浏览器样式前缀
const sourcemaps = require('gulp-sourcemaps'); // 一个信息文件，里面存储了代码打包转换后的位置信息，实质是一个 json 描述文件，维护了打包前后的代码映射关系，报错时可以成功定位到具体的报错位置

const webpackConfig = require("../webpack.config.js")
const named = require('vinyl-named') // vinyl-named 插件可以解决多页面开发的问题。不至于每次加页面都要去webpack 修改 entry 和 output
const webpack = require('webpack-stream')
const clc = require('cli-color')
const eslint = require('gulp-eslint'); // js代码校验
// const eslintConfig = require('../../.eslintrc')
let knownOptions = {
    string: ['name'],
    default: {
        name: ''
    }
};
let args = minimist(process.argv.slice(2), knownOptions);
const runProject = 'project/' + args.name // 开发环境目录
const serveProject = 'project-serve/' + args.name // 开发编译后浏览器真正运行的环境目录
const buildProject = 'dist/' + args.name // 打包目录

// html处理
const html = () => {
    // **/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js
    return gulp.src([runProject + '/**/*.html', `!(${runProject} + '/components/**/*.html)'`]) // 处理 src 目录里的所有 html 文件，但是不处理 src/components 里的 html 文件,  components 文件夹里的文件就是 “组件”，用来被引入到 html 去。
        // return gulp.src([runProject + '/**/*.html'])
        .pipe(changed(runProject + '/**/'))
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@', // 引用符号
            basepath: runProject + '/components' // 引用文件路径
        }))
        .pipe(gulp.dest(serveProject))
}

// scss处理
const scss = () => {
    return gulp.src([runProject + '/css/**/*.scss'])
        .pipe(changed(runProject + '/scss/**/'))
        .pipe(plumber())
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
        .pipe(gulp.dest(serveProject + '/css'))
}

// 图片处理
const images = () => {
    return gulp.src([runProject + '/images/**/*.{png,jpg,gif,jpeg,ico}']) //后缀都用小写，不然不识别
        .pipe(gulp.dest(serveProject + '/images'))
}

// js处理
const js = () => {
    return gulp.src([runProject + '/js/**/*.js'])
        .pipe(changed(runProject + '/js/**/'))
        .pipe(named(function (file) {
            return file.relative.slice(0, -path.extname(file.path).length)
        }))
        .pipe(webpack(webpackConfig))
        .pipe(plumber())
        .pipe(eslint({
            'rules': {
                'quotes': [1, 'double'],
                'semi': [1, 'always']
            }
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError())
        .pipe(gulp.dest(serveProject + '/js'))
}



// 浏览器运行webserver
const devServer = () => {
    return gulp.src(serveProject).pipe(webserver({
        port: 8888,
        livereload: true, // 是否实时加载
        open: true, // 是否自动打开
        // path: runProject,
        // directoryListing: true, // 是否开启浏览目录
        middleware: [
            fileMiddleware('../../../' + serveProject) // 运行时中间件
        ],
    }))
}

// 监听文件改变
function watcher() {
    gulp.watch(runProject + '/**/*.html', gulp.series(html)).on('unlink', function (basePath) { // 将src下被手动删除的html 也一并在dist下删除
        del(runProject + '/**/' + path.basename(basePath))
    })
    gulp.watch(runProject + '/css/**/*.scss', gulp.series(scss)).on('unlink', function (basePath) {
        var cssName = path.basename(basePath).split('.scss')[0] // scss 编译出来的文件后缀是 css 而不是 scss，需要特别处理
        del(runProject + '/scss/**/' + cssName + '.css')
    })
    gulp.watch(runProject + '/images/**/*.{png,jpg,gif,jpeg,ico}', gulp.series(images)).on('unlink', function (basePath) {
        del(runProject + '/images/**/' + path.basename(basePath))
    })
    gulp.watch(runProject + '/js/**/*.js', gulp.series(js)).on('unlink', function (basePath) {
        del(runProject + '/js/**/' + path.basename(basePath))
    })
}

const serve = () => {
    if (args.name == '') {
        log('needs project name! please gulp serve --name ${project}');
        return;
    }
    if (!fse.pathExistsSync(runProject)) {
        log('the project name is not existing!');
        return;
    }
    gulp.series(html, scss, images, js, devServer, watcher)()
}

function log(str, color) {
    console.log(clc.bold[color](str))
}

module.exports = serve
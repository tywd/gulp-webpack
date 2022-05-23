## 快速使用

1、安装依赖

    npm i  && cnpm i

2、初始化新项目

	HTML项目：gulp init --name $项目名 
    Vue项目： gulp initVue --name $项目名 
    
3、启动项目

    gulp serve --name $项目名 

4、打包项目

    gulp build --name $项目名 

## 说明
scripts/_template 支持组件引用，js模块化引入

## package.json 部分说明
```js
    "vinyl-named": "^1.1.0", // vinyl-named 插件可以解决多页面开发的问题。不至于每次加页面都要去webpack 修改 entry 和 output
    "vue": "^2.6.1", // 引入 vue 2.6.1
    "vue-loader": "^15.7.1", // 解析 vue文件
    "vue-template-compiler": "^2.6.1", // 支持引入vue组件写法 需要该 package 编译 template
    "webpack-stream": "^6.1.2", // 让 gulp 支持 webpack 模块化
```
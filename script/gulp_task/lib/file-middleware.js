/*
 * @Author: tywd
 * @Date: 2022-05-22 14:24:55
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-22 16:15:04
 * @FilePath: /gulp4-webpack/script/gulp_task/lib/file-middleware.js
 * @Description: 运行时中间件，运行项目有时会先打开该中间件生成页面来选择目录
 */
const path = require('path');
const fse = require('fs-extra')
const FileMiddleware = function (filePathProject) {
	let flag = true;
	return function (req, res, next) {
		let filePath = req._parsedUrl.pathname;
		try {
			if (flag) { // 首次需要读取该项目文件夹下的目录
				let dirs = fse.readdirSync(path.resolve(__dirname, filePathProject))
				let html = dir2html(filePath, dirs)
				res.write(html);
				flag = false
				return res.end();
			} else {
				let dirs = fse.readdirSync(path.resolve(__dirname, filePathProject + filePath));
				let html = dir2html(filePath, dirs);
				res.write(html);
				return res.end();
			}
		} catch (e) {
			console.log(e.message);
		}
		next();
	}
}


function dir2html(currentPath, paths) {
	currentPath = currentPath == '/' ? currentPath : currentPath + '/';
	let _listHtml = '';
	paths.forEach(el => {
		if (/\./.test(el)) {
			_listHtml += `<a class="file" href="${currentPath}${el}">${el}</a>`
		} else {
			_listHtml += `<a class="dir" href="${currentPath}${el}">${el}/</a>`
		}
	});


	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>web-workflow</title>
		<style>
			.link-list{display: flex;flex-direction: column;padding-left: 20px}
			a{line-height: 1.5;text-decoration: none;color: #8383ed;font-size: 20px;}
			a:hover{text-decoration:underline;}
			a.file{order: 2}
		</style>
	</head>
	<body>
		<div class="link-list">
			${_listHtml}
		</div>
	</body>
	</html>
	`
}

module.exports = FileMiddleware;
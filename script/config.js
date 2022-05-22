/*
 * @Author: tywd
 * @Date: 2022-05-22 23:16:30
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-22 23:16:30
 * @FilePath: /gulp4-webpack/script/config.js
 * @Description: Do not edit
 */
const CONFIG = {}

CONFIG.ENV = process.env.NODE_ENV
CONFIG.CDN = ''

if (CONFIG.ENV == 'production') {
  CONFIG.CDN = 'http://1.com'
} else {
  CONFIG.CDN = 'http://2.com'
}

module.exports = CONFIG
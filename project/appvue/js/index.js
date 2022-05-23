/*
 * @Author: tywd
 * @Date: 2022-05-23 00:34:30
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-23 19:29:39
 * @FilePath: /gulp4-webpack/project/appvue/js/index.js
 * @Description: Do not edit
 */
import {
    Vue,
} from './commons'
import Index from '../components/Index.vue';
const vm = new Vue({
    el: '#app',
    data() {
        return {
            name: 0
        }
    },
    components: {
        app: Index
    },
})
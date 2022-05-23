/*
 * @Author: tywd
 * @Date: 2022-05-23 00:34:30
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-23 20:56:22
 * @FilePath: /gulp4-webpack/project/appvue/js/index.js
 * @Description: Do not edit
 */
import {
    Vue,
} from './commons'
import Index from '../components/Index.vue';
import VueCompositionApi, {
    onMounted,
    toRefs,
    reactive
} from '@vue/composition-api';
Vue.use(VueCompositionApi)
const vm = new Vue({
    el: '#app',
    components: {
        app: Index
    },
    setup(props, context) {
        const state = reactive({
            name: 'tywd'
        })
        const test = () => {
            console.log('state.name: ', state.name);
        }
        return {
            ...toRefs(state),
            test
        }
    }
})
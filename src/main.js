import Vue from 'vue'
import Cookies from "js-cookie"
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import "normalize.css/normalize.css" // CSS重置的现代替代方法
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

import "@/styles/index.scss" //全局样式
import i18n from "./lang" //国际化
import "@/icons"
import "@/premission"

Vue.use(ElementUI, {
    size: Cookies.get("size") || "medium", //设置element-ui的默认尺寸
    i18n: (key, value) => i18n.t(key, value)
});
const {mockXHR} = require('../mock');
mockXHR();
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');

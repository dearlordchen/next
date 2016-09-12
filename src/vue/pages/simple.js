import Vue from 'vue' // 1.0.24
// 异步请求资源组件（json，jsonp等）
import VueResource from 'vue-resource'
import App from  '../view/App'

new Vue({
    el: '#app',
    // 初始化业务需要的数据，实际项目可以从pageMess拷贝
    components: { App }
});

// 打开调试
Vue.config.devtools = true 

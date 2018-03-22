import Vue from 'vue'

import 'normalize.css/normalize.css'// 样式初始化

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局样式
import uploader from 'vue-simple-uploader' // 上传组件
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // 国际化
import './icons' // 图标文件
import './errorLog'// 错误日志
import './permission'
// import './mock' // 数据模拟
import BaiduMap from 'vue-baidu-map'
import * as filters from './filters' // 全局过滤
// import DeProgress from '@/components/progress/index'

Vue.use(uploader)
Vue.use(Element, {
  size: 'medium', // 饿了么组件初始化
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(DeProgress)
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: '3alOYIEZTmAc41U9WpCn25g5W4M07t5N'
})
// 注册全局过滤
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

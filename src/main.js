import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './global.css'
import getRequestDomain from './requestDomain'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$requestDomain = getRequestDomain
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Router from 'vue-router'
import appInfo from './views/appInfo'
import appEdit from './views/appEdit'
import createApp from './views/createApp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: appInfo,
      meta: {
        title: "项目信息-Free my Mac",
        keepAlive: true
      }
    },
    {
      path: '/addApp',
      name: 'addApp',
      component: createApp,
      meta: {
        title: "新增项目-Free my Mac"
      }
    },
    {
      path: '/appEdit',
      name: 'appEdit',
      component: appEdit,
      meta: {
        title: "编辑项目-Free my Mac"
      }
    }
  ]
})

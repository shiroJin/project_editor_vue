import Vue from 'vue'
import Router from 'vue-router'
import appInfo from './views/appInfo'
// import addApp from './views/addApp'
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
        keepAlive: true
      }
    },
    {
      path: '/addApp',
      name: 'addApp',
      component: createApp
    },
    {
      path: '/appEdit',
      name: 'appEdit',
      component: appEdit
    }
  ]
})

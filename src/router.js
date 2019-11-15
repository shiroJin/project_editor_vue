import Vue from 'vue'
import Router from 'vue-router'
import appInfo from './views/appInfo'
import addApp from './views/addApp'
import appEdit from './views/appEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: appInfo
    },
    {
      path: '/addApp',
      name: 'addApp',
      component: addApp
    },
    {
      path: '/appEdit',
      name: 'appEdit',
      component: appEdit
    }
  ]
})

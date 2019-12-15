import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    needRefresh: false
  },
  mutations: {
    setNeedsRefresh (state) {
      state.needRefresh = true
    },
    setRefreshed (state) {
      state.needRefresh = false
    }
  },
  actions: {

  }
})

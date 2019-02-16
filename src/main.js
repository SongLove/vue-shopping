// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.filter('currency', currency)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: '/assets/logo.png',
  attempt: 1
})

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0,
  },
  mutations: {
    updataUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updataCartCount(state, cartCount) {
      state.cartCount += cartCount
    },
    initCartCount(state, cartCount) {
      state.cartCount = cartCount
    }
  }
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

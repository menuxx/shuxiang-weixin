// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './sotre'
import http from './http'
import './lib/type'
import {isProd} from './env'

console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV)

  if (!isProd()) {
    require.ensure([], function (require) {
      var VConsole = require('vconsole')
      new VConsole()
    })
  }

import 'font-awesome-webpack'

import {
    DatetimePlugin,
    CloseDialogsPlugin,
    ConfigPlugin,
    BusPlugin,
    DevicePlugin,
    ToastPlugin,
    AlertPlugin,
    ConfirmPlugin,
    LoadingPlugin,
    WechatPlugin
} from 'vux'

Vue.config.productionTip = false

FastClick.attach(document.body)

// 可以使用 this.$http 的方法来使用 axios
Vue.prototype.$http = http

// global VUX config
Vue.use(ConfigPlugin, {
    $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})

// plugins
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(BusPlugin)
Vue.use(DatetimePlugin)

new Vue({
    el: '#app',
	  http,
    router,
    store,
    render: h => h(App)
})

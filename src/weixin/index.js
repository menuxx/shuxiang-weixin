const WEIXIN_CONFIG_KEY = '__weixin__config__'

import isEmpty from 'is-empty'
import {getWeiXinConfig} from '../http/api'

// 等价对象
export const setWeixinConfig = (config) => {
  localStorage.setItem(WEIXIN_CONFIG_KEY, JSON.stringify({
    meta: { createAt: Date.now() },
    data: config
  }))
}

export const getWeixinConfig = () => {
  var itemJson = localStorage.getItem(WEIXIN_CONFIG_KEY)
  var data = JSON.parse(itemJson)
  // 一个小时缓存时间
  if ( isEmpty(data) ) { return null }
  if ( isEmpty(data.meta) ) { return null }
  if ( Date.now() - data.meta.createAt > 3600 * 1000  ) {
    return data.data
  }
}

/**
 * 文档
 * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
 * @param signature
 * 共享收货地址
 * https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_8&index=7
 */

var JS_API_LIST = ['openAddress', 'chooseWXPay', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'previewImage']

export const initConfig =  (wx, config) => {

  wx.config(Object.assign({}, {
    jsApiList: JS_API_LIST
  }, config))

  wx.checkJsApi({
    jsApiList: JS_API_LIST,
    success: function () {
      console.log('weixin-jsapi: config ok')
    }
  })

  return new Promise(function (resolve, reject) {
    // 就绪
    wx.ready(function () {
      resolve()
      console.log('weixin-jsapi: config ready!')
    })
    // 错误
    wx.error(function (err) {
      reject(err)
      console.log('weixin-jsapi: config error!', err)
    })
  })
}

/**
 * 同步服务器 config
 */
export const getWeixinConfigSync = (wx, url)=> {
  return getWeiXinConfig(url).then(res => {
    setWeixinConfig(res.data)
    return initConfig(wx, res.data.jsApiConfig)
  }, err => {
    console.log(err)
  })
}

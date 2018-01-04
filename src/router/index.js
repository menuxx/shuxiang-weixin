import Vue from 'vue'
import Router from 'vue-router'
import store from '../sotre'
import * as types from '../sotre/types'
import isEmpty from 'is-empty'
import qs from 'querystring'
import * as auth from '../http/auth'
import * as weixin from '../weixin'
import {getSessionTokenByCode, refreshSessionToken} from '../http/api'
import config from '../config'
import {isProd} from '../env'
import {RouteError} from '../lib/MyError'

// import HomePage from '@/components/HomePage/HomePage'
// import ChannelItem from '@/components/ChannelItem/ChannelItem'
// import ChannelItemPartnerList from '@/components/ChannelItem/PartnerList'
// import ObtainChannelItem from '@/components/ObtainChannelItem/ObtainChannelItem'
// import ConsumeObtainSuccess from '@/components/ConsumeObtainSuccess/ConsumeSuccess'
// import EditAddress from '@/components/EditAddress/EditAddress'
// import OrderList from '@/components/OrderList/OrderList'
// import Test1 from '@/components/Test/Test'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/test1',
      component: function(resolve) {
        require(['../components/ConsumeObtainSuccess/TestImage'], resolve)
      }
    },
    {
      // 首页
      path: '/',
      name: 'index',
      meta: { needAuth: true },
      component: function(resolve) {
        require(['../components/HomePage/HomePage'], resolve)
      }
    },
    {
      // 渠道书籍页面
      path: '/channels/:channelId/item',
      name: 'channel_item',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/VChannelItem/VChannelItem'], resolve)
      }
    },
    {
      // 渠道书籍页面
      path: '/channels/:channelId/partners',
      name: 'channel_partners',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/VChannelItem/PartnerList'], resolve)
      }
    },
    {
      // 持有一个 item ，待填写 address ，支付并领取
      path: '/obtain_channel/:channelId/item',
      name: 'obtain_channel_item',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/ObtainVChannelItem/ObtainVChannelItem'], resolve)
      }
    },
    {
      // 成功抢购一本书
      path: '/consume_obtain_success/:orderId',
      name: 'consume_obtain_success',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/ConsumeObtainSuccess/ConsumeSuccess'], resolve)
      }
    },
    {
      // 成功抢购后的分享页面
      path: '/v_channels/:channelId/share_image',
      name: 'channel_item_share',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/VChannelItem/ShareImage'], resolve)
      }
    },
    {
      // 用户收货地址管理
      path: '/user_address',
      meta: { needAuth: true },
      name: 'user_address',
      component: function (resolve) {
        require(['../components/EditAddress/EditAddress'], resolve)
      }
    },
    {
      // 订单列表
      path: '/order_list',
      meta: { needAuth: true },
      name: 'order_list',
      component: function (resolve) {
        require(['../components/OrderList/OrderList'], resolve)
      }
    }
  ]
})

function clearQueryWithUrl(argName, code, url) {
  return url.replace(`${argName}=${code}&`, '').replace(`${argName}=${code}`, '')
}

var timeId = null

// 如果一个路由不能再 2 内完成，就显示加载

router.afterEach((to) => {
  // 解除倒计时
  clearTimeout(timeId)
  store.commit(types.UPDATE_LOADING_STATE, { isLoading: false })
})

router.beforeEach((to, from, next) => {
  // 如果目标页面需要等露，就执行该验证流程
  if ( to.meta.needAuth ) {
    // 微信回传的 code
    var {code, state} = qs.parse(location.search.substr(1))
    if ( !isEmpty(code) ) {
      var href = location.href
      // 如果有 多个 code 全部替换掉
      if ( Array.isArray(code) ) {
        auth.newAuthCode(code[0])
        code.forEach(aCode => {
          href = clearQueryWithUrl('code', aCode, href)
        })
      } else {
        auth.newAuthCode(code)
        href = clearQueryWithUrl('code', code, href)
      }
      if ( Array.isArray(state) ) {
        state.forEach(aState => {
          href = clearQueryWithUrl('state', aState, href)
        })
      } else {
        href = clearQueryWithUrl('state', state, href)
      }
      // 存储 code 等待使用
      return location.href = href  // 刷新一个 没有 code 的url 防止出现 code 错误的问题 会导致页面重新刷新一次
    } else {
      var authCode = auth.authCodeConsumed()
      if (isEmpty(authCode)) {
        var token = auth.getMyAuthToken()
        if ( isEmpty(token) ) {
          // 如果是因为 authToken 过期导致无法取得 token 的话，就刷新 token
          var expired = auth.myAuthTokenExpired() && !isEmpty(auth.getMyExpiredToken())
          if ( expired ) {
            // 就去刷新该令牌
            return refreshSessionToken(auth.getMyExpiredToken()).then((newToken) => {
              // 刷新令牌成功
              auth.setMyAuthToken(newToken)
              // 更新状态, 如果用户在当前页刷新，防止出现登录状态消失
              store.commit(types.USER_AUTH_TOKEN_UPDATE, { token, userInfo: auth.getUserInfo() })
              return next()
            }, (err) => {
              // 如果刷新令牌失败
              next(new RouteError(502, null, err.stack))
            })
          } else {
            // 跳转到微信的授权
            if ( !isProd() ) {
              // 跳转到中间授权店，为该域名 回到 code ，只会回调到 wxdev.qurenjia.com 这个域名商
              location.href = auth.buildAuthAuthorizeUrl(config.WeiXin.mpAppId, config.Domain.AuthEntryPointUrl + location.hash)
            } else {
              // 生产环境正常流程
              location.href = auth.buildAuthAuthorizeUrl(config.WeiXin.mpAppId, location.href)
            }
            return next(new Error('还没有登录吧，快去授权', 401))
          }
        } else {
          store.commit(types.USER_AUTH_TOKEN_UPDATE, { token, userInfo: auth.getUserInfo() })
          // 该用户已经登录
          return next()
        }
      } else {
        // 如果该用户是使用 code 来登录
        return getSessionTokenByCode(authCode).then(res => {
          var {token, userInfo} = res.data
          auth.setMyAuthToken(token)
          auth.setUserInfo(userInfo)
          // 更新状态, 如果用户在当前页刷新，防止出现登录状态消失
          store.commit(types.USER_AUTH_TOKEN_UPDATE, { token, userInfo })
          // 登录完成了
          return next()
        }, (err) => {
          // 服务器登录失败
          return next(new RouteError(502, null, err.stack))
        })
      }
    }
  }
  next()
})

router.beforeEach((to, from, next) => {

  try {

    weixin.removeWeiXinConfig()

    timeId = setTimeout(function () {
      store.commit(types.UPDATE_LOADING_STATE, { isLoading: true })
    }, 2000)

    function wxInitSuccess() {
      // 量秒内不能完成跳转，就显示 loading
      console.log('weixin-jspai: init successfully')
      next()
    }

    function wxInitFail(err) {
      alert('出错了，微信初始化失败:' + err.message)
    }

    var wxConfig = weixin.getWeiXinConfig()

    console.log('weixin-jspai: config', wxConfig)

    if ( !isEmpty(wxConfig) ) {
      weixin.initConfig(Vue.wechat, wxConfig).then(wxInitSuccess, wxInitFail)
    } else {
      console.log('weixin-jspai => url:' + location.href)
      weixin.getWeiXinConfigSync(Vue.wechat, location.href).then(wxInitSuccess, wxInitFail)
    }
  } catch (e) {
    console.error(e)
  }
})

router.onError((err) => {
  switch (err.code) {
    case 302:
      clearTimeout(timeId)
      store.commit(types.UPDATE_LOADING_STATE, { isLoading: false })
      router.replace(err.nextRouteParams)
      break;
    case 401:
      break;
    case 503:
      console.error(err)
  }
})


export default router

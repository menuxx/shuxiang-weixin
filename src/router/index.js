import Vue from 'vue'
import Router from 'vue-router'
import store from '../sotre'
import * as types from '../sotre/types'
import isEmpty from 'is-empty'
import qs from 'querystring'
import * as auth from '../http/auth'
import {getSessionTokenByCode, refreshSessionToken} from '../http/api'
import config from '../config'

// import HomePage from '@/components/HomePage/HomePage'
// import ChannelItem from '@/components/ChannelItem/ChannelItem'
// import ChannelItemPartnerList from '@/components/ChannelItem/PartnerList'
// import ObtainItem from '@/components/ObtainItem/ObtainItem'
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
        require(['../components/Test/Test'], resolve)
      }
    },
    {
      // 首页
      path: '/',
      meta: { needAuth: true },
      component: function(resolve) {
        require(['../components/HomePage/HomePage'], resolve)
      }
    },
    {
      // 渠道书籍页面
      path: '/channels/:channelId/item',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/ChannelItem/ChannelItem'], resolve)
      }
    },
    {
      // 渠道书籍页面
      path: '/channels/:channelId/partners',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/ChannelItem/PartnerList'], resolve)
      }
    },
    {
      // 持有一个 item ，待填写 address ，支付并领取
      path: '/obtain_item/:itemId',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/ObtainItem/ObtainItem'], resolve)
      }
    },
    {
      // 成功抢购一本书
      path: '/consume_obtain_success/:itemId',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/ConsumeObtainSuccess/ConsumeSuccess'], resolve)
      }
    },
    // {
    //   // 成功抢购后的分享页面
    //   path: '/consume_obtain_success/:itemId/share_image',
    //   component: CanvasImageShare
    // },
    {
      // 用户收货地址管理
      path: '/user_address',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/EditAddress/EditAddress'], resolve)
      }
    },
    {
      // 订单列表
      path: '/order_list',
      meta: { needAuth: true },
      component: function (resolve) {
        require(['../components/OrderList/OrderList'], resolve)
      }
    }
  ]
})

function withOutCodeUrl(code, url) {
  return url.replace(`code=${code}&`, '').replace(`code=${code}`, '')
}

var timeId = null

// 如果一个路由不能再 2 内完成，就显示加载
router.beforeEach((to, from, next) => {
  // 量秒内不能完成跳转，就显示 loading
  timeId = setTimeout(function () {
    store.commit(types.UPDATE_LOADING_STATE, { isLoading: true })
  }, 2000)
  next()
})

router.afterEach((to) => {
  // 解除倒计时
  clearTimeout(timeId)
  store.commit(types.UPDATE_LOADING_STATE, { isLoading: false })
})

router.beforeEach((to, from, next) => {
  // 如果目标页面需要等露，就执行该验证流程
  if ( to.meta.needAuth ) {
    // 微信回传的 code
    var {code} = qs.parse(location.search.substr(1))
    if ( !isEmpty(code) ) {
      var href = location.href
      // 如果有 多个 code 全部替换掉
      if ( Array.isArray(code) ) {
        auth.newAuthCode(code[0])
        code.forEach(aCode => {
          href = withOutCodeUrl(aCode, href)
        })
      } else {
        auth.newAuthCode(code)
        href = withOutCodeUrl(code, href)
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
              next(err)
            })
          } else {
            // 跳转到微信的授权
            location.href = auth.buildAuthAuthorizeUrl(config.WeiXin.mpAppId, location.href)
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
          return next(err)
        })
      }
    }
  }
  next()
})

router.onError((err) => {
  switch (err.id) {
    case 401:
      //
      // if () {

      // }
  }
})


export default router

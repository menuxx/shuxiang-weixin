import {isProd} from '../env'

import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

var plugins = []

if (process.env.NODE_ENV !== 'development') {
	var createLogger = require('vuex/dist/logger')
  plugins.push(createLogger())
}

const state = {
  app: {
    windowTitle: '',
    showLoading: false,
  },
  auth: {
    token: null,
    userInfo: null
  },
	// 地址列表
	addresses: [],
  // 抢书渠道
  channelItem: {
    // 赠语
    giftTxt: null,
    // 渠道发起人头像
    ownerAvatar: null,
    // 渠道的发起人
    ownerName: null,
    // 库存个数（全部）
    stock: 0,
    // 参与者人数
    partnerCount: 0,
    // 参与者列表, id 为 键
    partners: [],
    // 当前打开的渠道 id
    channelId: 0,
    // 长轮询应用id
    loopRefId: null,
    // 书籍
    item: null
  },
  // 消费订单详情
  consumeChannelOrderDetails: null,
	// 抢购订单
	channelOrder: {
    	// 收货人信息
    	receiver : {
    		receiverName: '', // 联系人姓名
			  phoneNumber: '',	// 联系人手机号
        areaAddress: '',	// 所在地址 省，市，县
			  postalCode: '', // 邮编
			  detailInfo: '' // 具体收货地址，精确到小区楼宇
		},
		// 抢到的书籍
		obtainItem: {
		}
	},
	orders: []
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    plugins,
    mutations,
    strict: isProd()
})

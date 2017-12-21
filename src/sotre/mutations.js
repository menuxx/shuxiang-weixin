
import {cdnFullUrl} from '../filters'
import {QiNiuImagePrefix} from '../config'
import * as types from './types'

// 此处更新 state

export default {
  // 更新 app loading
  [types.UPDATE_LOADING_STATE] (state, payload) {
    state.app.showLoading = payload.isLoading
  },
  [types.USER_AUTH_TOKEN_UPDATE] (state, payload) {
    state.auth.token = payload.token
    state.auth.userInfo = payload.userInfo
  },
	[types.CHANNEL_ITEM_LOADED] (state, payload) {
    // 计数器数量
    state.channelItem.ownerName = payload.ownerName
    state.channelItem.ownerAvatar = payload.ownerAvatar
    state.channelItem.giftTxt = payload.giftTxt
    state.channelItem.channelId = payload.id
    // 参与者人数
    state.channelItem.partners = []
    // 得到还剩下多少本书
    // state.channelItem.remainNum = 库存数 - 订单数
    state.channelItem.item = payload.item
    // 处理图片 url
    state.channelItem.item.coverImageUrl = cdnFullUrl(payload.item.coverImage, QiNiuImagePrefix.item)

    state.channelItem.stock = payload.stock
	},
  /**
   * 更新我的收货人地址信息
   * @param state
   * @param payload
   * {
   *    id: '', // 地址id
   *    receiverName: '', // 联系人姓名
			  phoneNumber: '',	// 联系人手机号
        province: '',	// 所在地址 省，市，县
        city: '',
        country: '',
			  postalCode: '', // 邮编
			  detailInfo: '' // 具体收货地址，精确到小区楼宇
		  }
   */
  // 更新收货人信息
  [types.MY_RECEIVER_ADDRESS_UPDATE] (state, payload) {
    state.channelOrder.receiver = payload
  }
}

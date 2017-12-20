
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
	}
}

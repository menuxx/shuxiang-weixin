
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
	[types.CHANNEL_ITEM_LOADED] (state, { channel, partner }) {
    // 计数器数量
    state.channelItem.ownerName = channel.ownerName
    state.channelItem.ownerAvatar = channel.ownerAvatar
    state.channelItem.giftTxt = channel.giftTxt
    state.channelItem.channelId = channel.id
    // 参与者人数
    state.channelItem.partners = partner.users
    state.channelItem.partnerCount = partner.count
    // 得到还剩下多少本书
    // state.channelItem.remainNum = 库存数 - 订单数
    state.channelItem.item = channel.item
    // 处理图片 url
    state.channelItem.item.coverImageUrl = cdnFullUrl(channel.item.coverImage, QiNiuImagePrefix.item)
    state.channelItem.stock = channel.stock
    state.channelItem.remainNum = channel.stock - partner.count
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
  [types.MY_RECEIVER_ADDRESS_UPDATE] (state, receiverAddr) {
    state.channelOrder.receiver = receiverAddr
  },
  // 地址更新
  [types.MY_ADDRESS_UPDATED] (state, updatedAddr) {
    state.addresses.forEach( (adr, index) => {
      if ( adr.id === updatedAddr.id ) {
        state.addresses[index] = updatedAddr
      }
    })
  },
  [types.MY_ADDRESSES_LOADED] (state, addresses) {
    state.addresses = addresses
  },
  [types.MY_ADDRESS_ADDED] (state, newAddress) {
    state.addresses.push(newAddress)
  },
  // 更新默认地址数据
  [types.MY_ADDRESS_PRIMARY_UPDATED] (state, updateAddressId) {
    state.addresses.forEach( (addr, index) => {
      if ( addr.primary === 1 ) {
        state.addresses[index].primary = 0
      }
      if ( addr.id === updateAddressId ) {
        state.addresses[index].primary = 1
      }
    })
  },
  [types.MY_ADDRESS_DELETED] (state, addressId) {
    // 状态删除
    state.addresses.forEach( (adr, index) => {
      if ( adr.id === addressId ) {
        state.addresses.splice(index, 1)
      }
    })
  },
  /**
   * 单个订单加载
   */
  [types.MY_CONSUME_ORDER_LOADED] (state, orderDetails) {
    state.consumeChannelOrderDetails = orderDetails
  }
}

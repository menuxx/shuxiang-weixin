
import * as api from '../http/api'
import * as types from './types'

// 此处发起异步请求

export default {

	/**
	 * 加载商品
	 * @param commit
	 * @param channelId
	 */
	// getChannelItem({commit}, channelId) {
	// 	return api.getVipChannelItem(channelId).then( channelItem => {
	// 		commit(types.CHANNEL_ITEM_LOADED, channelItem)
	// 		return channelItem
	// 	})
	// },

	/**
	 * 获取我的 primary 地址
	 */
	// getPrimaryAddress({commit}) {
	// 	return api.getMyPrimaryAddress().then( address => {
	// 		commit(types.MY_PRIMARY_ADDRESS_LOADED, address)
	// 		return address
	// 	})
	// },

	/**
	 * 获取我的地址列表
	 */
	// loadMyAddresses({commit}) {
	// 	return api.getMyAddresses().then( addresses => {
	// 		commit(types.MY_ADDRESSES_LOADED, addresses)
	// 		return addresses
	// 	})
	// },

  /**
   * 添加一个地址
   */
  addNewAddress({commit}, address) {
    return api.addNewAddress(address).then( res => {
      commit(types.MY_ADDRESS_ADDED, res.data)
      return res.data
    })
  },

	/**
	 * 更新我的地址
	 */
	updateAddress({commit}, address) {
		return api.updateMyAddress(address.id, address).then( res => {
      commit(types.MY_ADDRESS_UPDATED, address)
			return res.data
		})
	},

	/**
	 * 删除地址
	 */
	delAddress({commit}, addressId) {
		return api.delAddress(addressId).then( res => {
      commit(types.MY_ADDRESS_DELETED, addressId)
			return res.data
		})
	},

  setPrimaryAddress({commit}, addressId) {
	  return api.primaryAddress(addressId).then( res => {
      commit(types.MY_ADDRESS_PRIMARY_UPDATED, addressId)
      return res.data
    })
  },

	/**
	 * 根据 订单 状态筛选订单
	 * 有分页机制
	 */
	loadMyOrders({commit}, { status, pageNum=1, pageSize=10 }) {
		return api.loadMyOrders({ status, pageNum, pageSize }).then( res => {
		  var orders = res.data
			commit(types.MY_ORDERS_LOADED, orders)
			return orders
		})
	},

  /**
   * 根据订单id获取订单详情
   */
  getOrderDetailsById({commit}, orderId) {
	  return api.getOrderDetailsById(orderId).then( res => {
	    return res.data
    })
  }
}

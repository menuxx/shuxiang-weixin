
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
	getPrimaryAddress({commit}) {
		return api.getMyPrimaryAddress().then( address => {
			commit(types.MY_PRIMARY_ADDRESS_LOADED, address)
			return address
		})
	},

	/**
	 * 获取我的地址列表
	 */
	loadMyAddress({commit}) {
		return api.getMyAddresses().then( addresses => {
			commit(types.MY_ADDRESSES_LOADED, addresses)
			return addresses
		})
	},

	/**
	 * 更新我的地址
	 */
	updateAddress({commit}, address) {
		return api.updateAddress(address.id, address).then( isOk => {
			if ( isOk.code === api.ApiSuccess ) {
				commit(types.MY_ADDRESS_UPDATED_OK, address)
			} else {
				commit(types.MY_ADDRESS_UPDATED_FAIL, address)
			}
			return isOk
		})
	},

	/**
	 * 删除地址
	 */
	delAddress({commit}, addressId) {
		return api.delAddress(addressId).then( isOk => {
			if ( isOk.code === api.ApiSuccess ) {
				commit(types.MY_ADDRESS_DELETE_OK, addressId)
			} else {
				commit(types.MY_ADDRESS_DELETE_FAIL, addressId)
			}
			return isOk
		})
	},

	/**
	 * 添加一个地址
	 */
	addAddress({commit}, address) {
		return api.addAddress(address).then( resAddr => {
			commit(types.MY_ADDRESS_ADDED, resAddr)
			return resAddr
		})
	},

	/**
	 * 根据 订单 状态筛选订单
	 * 有分页机制
	 */
	loadMyOrders({commit}, { status, pageNum=1, pageSize=10 }) {
		return api.loadMyOrders({ status, pageNum, pageSize }).then( orders => {
			commit(types.MY_ORDERS_LOADED, orders)
			return orders
		})
	}
}

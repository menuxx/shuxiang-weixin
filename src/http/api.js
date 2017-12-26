
import http from './index'

export const ApiSuccess = 1

export const ObtainChannelItem = '/v_channel_store/{channelId}/obtain'

// 轮询抢购请求的状态
export const LoopChannelItemState = '/v_channel_store/{channelId}/long_loop_state'

/**
 * 获取一个 channel item 的详细信息
 * @param channelId
 * @returns {AxiosPromise<any>}
 */
export const getVipChannelItem = channelId => {
	return http.get(`/v_channels/${channelId}`)
}

/**
 * 通过 code 换取 sessionToken
 * @param code
 */
export const getSessionTokenByCode = code => {
  return http.put(`/wxauth/auth_code_to_token`, { code })
}

/**
 * 刷新会话 token
 */
export const refreshSessionToken = (token) => {
  return http.put(`/wxauth/refresh_token`, { token })
}

/**
 * 获取微信配置
 */
export const fetchWeiXinConfig = (url) => {
  return http.get(`/weixin/config?url=${encodeURIComponent(url)}`)
}

/**
 * 请求消费一个持有（抢到的东西）
 * @param channelId
 * @param addressId
 * @returns {AxiosPromise<any>}
 */
export const requestConsumeObtain = (channelId, addressId) => {
  return http.put(`/v_channel_store/${channelId}/consume`, { addressId })
}

/**
 *  更新 指定的 地址
 * @param addressId
 * @param address
 * @returns {AxiosPromise<any>}
 */
export const updateMyAddress = (addressId, address) => {
  return http.put(`/user_addresses/${addressId}`, address)
}

export const getMyAddresses = () => {
  return http.get(`/user_addresses`)
}

/**
 * 新增一个地址
 * @param address
 * @returns {AxiosPromise<any>}
 */
export const addNewAddress = (address) => {
  return http.post(`/user_addresses`, address)
}

/**
 * 删除地址
 * @param addressId
 * @returns {AxiosPromise}
 */
export const delAddress = (addressId) => {
  return http.delete(`/user_addresses/${addressId}`)
}

/**
 * 设置一个地址为默认地址
 * @param addressId
 * @returns {AxiosPromise<any>}
 */
export const primaryAddress = (addressId) => {
  return http.put(`/user_addresses/${addressId}/primary`)
}

/**
 * 获取我的默认地址
 * @returns {AxiosPromise<any>}
 */
export const getMyPrimaryAddress = () => {
  return http.get(`/user_addresses/primary`)
}

/**
 * 获取 指定的 地址
 * @param addressId
 * @returns {AxiosPromise<any>}
 */
export const getMyAddress = (addressId) => {
  return http.get(`/user_addresses/${addressId}`)
}

export const getOrderDetailsById = orderId => {
  return http.get(`orders/${orderId}`)
}

export const loadMyOrders = () => {

}

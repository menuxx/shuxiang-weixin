
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
 * 获取我在渠道中的订单
 * @param channelId
 * @returns {AxiosPromise<any>}
 */
export const getMyChannelOrder = channelId => {
  return http.get(`/v_channels/${channelId}/order`)
}

/**
 * 过去用户在 channelStore 中的状态，如果不在抢购状态，回去数据库中超找
 * @param channelId
 * @param loopRefId
 * @returns {AxiosPromise<any>}
 */
export const getVChannelStoreUserState = (channelId, loopRefId='') => {
  var loopRefIdQs = ''
  if ( /[0-9]*:.*/.test(loopRefId)) {
    loopRefIdQs = `loopRefId=${loopRefId}`
  }
  return http.get(`/v_channel_store/${channelId}/user_state?${loopRefIdQs}`)
}


/**
 * 获取一个 channel 相关的所有订单
 * 只包含订单数量 和订单用户
 * count
 * user 50
 */
export const getVChannelOrders = (channelId, pageNum=1, pageSize=10) => {
  return http.get(`/v_channels/${channelId}/order_users?pageNum=${pageNum}&pageSize=${pageSize}`)
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

/**
 * 获取订单详情
 * @param orderId
 * @returns {AxiosPromise<any>}
 */
export const getOrderDetailsById = orderId => {
  return http.get(`orders/${orderId}`)
}

/**
 * 获取指定的用户订单
 * @param orderId
 * @returns {AxiosPromise<any>}
 */
export const getUserOrderDetails = orderId => {
  return http.get(`/user/orders/${orderId}`)
}

export const loadMyOrders = (pageNum=1) => {
  return http.get(`/user/orders?pageNum=${pageNum}`)
}

/**
 * 更新订单分享图片
 * @param orderId
 * @param shareImage
 * @returns {AxiosPromise<any>}
 */
export const updateOrderShareImage = (orderId, shareImage) => {
  return http.put(`/user/orders/${orderId}/share_image`, { shareImage })
}

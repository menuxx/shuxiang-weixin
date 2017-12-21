
import http from './index'

export const ApiSuccess = 0

// 获取一个 channel item 的详细信息
export const VipChannelItem = '/vip_channels/{channelId}'
// 发起一个抢购请求
export const ObtainChannelItem = '/channel_store/{channelId}/obtain'
// 查看 channel_store 中的基本信息
export const GetChannelStoreInfo = '/channel_store/{channelId}'
// 轮询抢购请求的状态
export const LoopChannelItemState = '/channel_store/{channelId}/long_loop_state'
// 获取我的默认地址
export const GetMyPrimaryAddress = '/user_addresses/primary'
// 加载 用户 地址
export const LoadMyAddresses = '/user_addresses'
// 获取 指定的 地址
export const GetMyAddress = '/user_addresses/{addressId}'
// 删除地址
export const DelMyAddress = '/user_addresses/addressId'

export const UpdateMyAddress = '/user_addresses/{addressId}'

// 请求消费一个持有（抢到的东西）
export const RequestConsumeObtain = '/channel_store/{channelId}/consume'

export const getVipChannelItem = channelId => {
	return http.get(VipChannelItem.replace('{channelId}', channelId))
}

export const getMyPrimaryAddress = () => {
	return http.get(GetMyPrimaryAddress)
}

export const loadMyAddresses = () => {
	return http.get(LoadMyAddresses)
}

export const getMyAddress = (addressId) => {
	return http.get(GetMyAddress.replace('{addressId}', addressId))
}

export const updateMyAddress = (addressId, address) => {
	return http.put(UpdateMyAddress.replace('{addressId}', addressId), address)
}

export const delMyAddress = (addressId) => {
	return http.delete(DelMyAddress.replace('{addressId}', addressId))
}

/**
 * 通过 code 换取 sessionToken
 * @param code
 */
export const getSessionTokenByCode = ( code ) => {
  return http.put(`/auth/auth_code_to_token`, { code })
}

/**
 * 刷新会话 token
 */
export const refreshSessionToken = (token) => {
  return http.put(`/auth/refresh_token`, { token })
}

/**
 * 获取微信配置
 */
export const getWeiXinConfig = (url) => {
  return http.get(`/weixin/config?url=${encodeURIComponent(url)}`)
}

/**
 * 请求消费一个持有
 * @param channelId
 * @param addressId
 * @returns {AxiosPromise<any>}
 */
export const requestConsumeObtain = (channelId, addressId) => {
  return http.put(RequestConsumeObtain.replace('{channelId}', channelId), { addressId })
}

export const getMyAddresses = () => {}

export const updateAddress = () => {}

export const delAddress = () => {}

export const addAddress = () => {}

export const loadMyOrders = () => {}

/**
 * 获取渠道的订单信息包括
 * @param channelId
 * 订单数
 * 订单人信息(用户名，头像，用户 id 等信息)
 */
export const getChannelOrderInfo = (channelId) => {}

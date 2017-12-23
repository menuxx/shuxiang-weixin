
import http from './index'
import {MY_ADDRESSES_LOADED} from "../sotre/types";

export const ApiSuccess = 0

// 获取一个 channel item 的详细信息
const VipChannelItem = '/vip_channels/{channelId}'
// 发起一个抢购请求
export const ObtainChannelItem = '/channel_store/{channelId}/obtain'
// 轮询抢购请求的状态
export const LoopChannelItemState = '/channel_store/{channelId}/long_loop_state'
// 获取我的默认地址
const GetMyPrimaryAddress = '/user_addresses/primary'
// 加载 用户 地址
const LoadMyAddresses = '/user_addresses'
// 获取 指定的 地址
const GetMyAddress = '/user_addresses/{addressId}'
// 更新 指定的 地址
const UpdateMyAddress = '/user_addresses/{addressId}'
// 删除地址
const DelMyAddress = '/user_addresses/{addressId}'
// 新增一个地址
const InsertMyAddress = '/user_addresses'
// 设置一个地址为默认地址
const SetMyPrimaryAddress = '/user_addresses/{addressId}/primary'

// 请求消费一个持有（抢到的东西）
export const RequestConsumeObtain = '/channel_store/{channelId}/consume'

export const getVipChannelItem = channelId => {
	return http.get(VipChannelItem.replace('{channelId}', channelId))
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
export const fetchWeiXinConfig = (url) => {
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

export const updateMyAddress = (addressId, address) => {
  return http.put(UpdateMyAddress.replace('{addressId}', addressId), address)
}

export const getMyAddresses = () => {
  return http.get(LoadMyAddresses)
}

export const addNewAddress = (address) => {
  return http.post(InsertMyAddress, address)
}

export const delAddress = (addressId) => {
  return http.delete(DelMyAddress.replace('{addressId}', addressId))
}

export const primaryAddress = (addressId) => {
  return http.put(SetMyPrimaryAddress.replace('{addressId}', addressId))
}

export const getMyPrimaryAddress = () => {
  return http.get(GetMyPrimaryAddress)
}

export const getMyAddress = (addressId) => {
  return http.get(GetMyAddress.replace('{addressId}', addressId))
}

export const loadMyOrders = () => {}

/**
 * 获取渠道的订单信息包括
 * @param channelId
 * 订单数
 * 订单人信息(用户名，头像，用户 id 等信息)
 */
export const getChannelOrderInfo = (channelId) => {

}

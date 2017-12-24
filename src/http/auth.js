
import isEmpty from 'is-empty'

const AUTHTOKEN_STORAGE_KEY = '__user_token__'
const USERINFO_STORAGE_KEY = '__user_info__'
const AUTHCODE_STORAGE_KEY = '__weixin_code__'

/**
 * 生成跳转到微信授权的 url
 * @param appId
 * @param redirectUrl
 * @returns {string}
 */
export const buildAuthAuthorizeUrl = (appId, redirectUrl) => {
  var scope = 'snsapi_userinfo'
  var state = 'sxauth'
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  if ( !isEmpty(getMyAuthToken()) ) {
    return localStorage[USERINFO_STORAGE_KEY].data
  }
}

/**
 * 设置用户信息
 * @param user
 */
export const setUserInfo = (user) => {
  var data = { meta: { createAt: Date.now() }, data: user }
  return localStorage.setItem(USERINFO_STORAGE_KEY, JSON.stringify(data))
}

/**
 * 检测当前存储的 authToken 是否过期
 * 返回 false 并不能表示 token 已经过期, 返回 true 标识 token 没有过期
 * 需要配合 getMyExpiredToken 类确定一个 token 是否确实过期
 * @returns {boolean}
 */
export const myAuthTokenExpired = () => {
  var dataJson = localStorage.getItem(AUTHTOKEN_STORAGE_KEY)
  if (isEmpty(dataJson)) { return false }
  var data = JSON.parse(dataJson)
  if ( isEmpty(data) ) { return false }
  if ( isEmpty(data.meta) ) { return false }
  return Date.now() - data.meta.createAt > 7200 * 1000
}

/**
 * 获取 authtoken
 * 过期了也能获取到
 * @returns {*}
 */
export const getMyExpiredToken = () => {
  var dataJson = localStorage.getItem(AUTHTOKEN_STORAGE_KEY)
  var data = JSON.parse(dataJson)
  if ( isEmpty(data) ) { return null }
  return data.data
}

/**
 * 获取我的认证令牌
 * 7200 秒后过期获取不到
 */
export const getMyAuthToken = () => {
    var dataJson = localStorage.getItem(AUTHTOKEN_STORAGE_KEY)
    var data = JSON.parse(dataJson)
    // token 的有效期是 7200 秒
    if ( isEmpty(data) ) { return null }
    if ( isEmpty(data.meta) ) { return null }
    if ( Date.now() - data.meta.createAt > 7200 * 1000  ) {
      localStorage.removeItem(AUTHTOKEN_STORAGE_KEY)
      return null
    } else {
      return data.data
    }
}

export const newAuthCode = (code) => {
  localStorage.setItem(AUTHCODE_STORAGE_KEY, code)
}

export const authCodeConsumed = () => {
  var code = localStorage.getItem(AUTHCODE_STORAGE_KEY)
  localStorage.removeItem(AUTHCODE_STORAGE_KEY)
  return code
}

/**
 * 设置 token ，将有效时间设置为 7200 秒
 * @param token
 */
export const setMyAuthToken = (token) => {
  var data = { meta: { createAt: Date.now() }, data: token }
  localStorage.setItem(AUTHTOKEN_STORAGE_KEY, JSON.stringify(data))
}



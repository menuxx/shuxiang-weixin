
import http from './http'
import * as api from './http/api'
import isEmpty from 'is-empty'
import debounce from 'debounce-promise'

const OBTAIN_ITEM_LOOP_REF_ID = '__obtainitem__looprefid__'

export const getLoopRefId = () => {
  var itemJson = localStorage.getItem(OBTAIN_ITEM_LOOP_REF_ID)
  var data = JSON.parse(itemJson)
  // 保活10分钟
  if ( isEmpty(data) ) { return null }
  if ( isEmpty(data.meta) ) { return null }
  if ( Date.now() - data.meta.createAt > 600 * 1000  ) {
    setLoopRefId(data.data)
    return data.data
  }
  return null
}

// 释放该 loopRefId
export const freeLoopRefId = () => {
  localStorage.removeItem(OBTAIN_ITEM_LOOP_REF_ID)
}

// 等价对象
export const setLoopRefId = (config) => {
  localStorage.setItem(OBTAIN_ITEM_LOOP_REF_ID, JSON.stringify({
    meta: { createAt: Date.now() },
    data: config
  }))
}


/**
 * 轮询渠道状态
 *
 * debounceLoopChannelState(channelId, loopRefId)
 */

var debounceLoopChannelFn = function () {}

export const loopChannelState = (channelId, loopRefId) => {
  var loopUrl = api.LoopChannelItemState.replace('{channelId}', channelId) + '?loopRefId=' + loopRefId
  return http.get(loopUrl).then((res) => {
    var {stateCode} = res.data
    return stateCode
  })
}


export const debounceLoopChannelState = (channelId, loopRefId) => {
  debounceLoopChannelFn = debounce(function () { return loopChannelState(channelId, loopRefId); }, 800)
  // 第一次运行没有返回第二次会有
  return debounceLoopChannelFn()
}

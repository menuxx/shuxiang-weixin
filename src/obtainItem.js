
import http from './http'
import * as api from './http/api'
import isEmpty from 'is-empty'
import debounce from 'debounce-promise'

const OBTAIN_ITEM_LOOP_REF_ID = '__obtainitem__looprefid__'

export const getLoopRefId = (channelId) => {
  var itemJson = localStorage.getItem(channelId + ':' + OBTAIN_ITEM_LOOP_REF_ID)
  var data = JSON.parse(itemJson)
  // 保活10分钟
  if ( isEmpty(data) ) { return null }
  if ( isEmpty(data.meta) ) { return null }
  if ( Date.now() - data.meta.createAt > 600 * 1000  ) {
    setLoopRefId(channelId, data.data)
    return data.data
  }
  return null
}

// 释放该 loopRefId
export const freeLoopRefId = (channelId) => {
  localStorage.removeItem(channelId + ':' + OBTAIN_ITEM_LOOP_REF_ID)
}

// 等价对象
export const setLoopRefId = (channelId, config) => {
  localStorage.setItem(channelId + ':' + OBTAIN_ITEM_LOOP_REF_ID, JSON.stringify({
    meta: { createAt: Date.now() },
    data: config
  }))
}


/**
 * 轮询渠道状态
 *
 * debounceLoopChannelState(channelId, loopRefId)
 */

export const loopChannelState = (channelId, loopRefId) => {
  var loopUrl = api.LoopChannelItemState.replace('{channelId}', channelId) + '?loopRefId=' + loopRefId
  return http.get(loopUrl).then((res) => {
    var {stateCode} = res.data
    return stateCode
  })
}


export const debounceLoopChannelState = (channelId, loopRefId, fn) => {
  var isNext = 1;
  var nextFn = debounce(function () { return loopChannelState(channelId, loopRefId); }, 800)
  function _next(resolve, reject) {
    nextFn().then( res => {
      fn(res, function (data) { isNext = 0; if (data) { resolve(data); } })
      if (isNext === 1) {
        _next(resolve, reject)
      }
    })
  }
  return new Promise(function (resolve, reject) {
    _next(resolve, reject)
  })
}

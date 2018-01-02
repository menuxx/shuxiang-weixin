
import {Domain} from '../config'

export const makeSameOriginUrl = function (url) {
  if ( url.startsWith('http://') ) {
    url = url.replace('http://', '')
  } else if ( url.startsWith('https://') )  {
    url = url.replace('https://', '')
  }
  return `${Domain.SiteBaseUrl}/proxy/${url}`
}

export const isAndroid = function () {
  return /android/i.test(navigator.userAgent)
}

export const isIOS = function () {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

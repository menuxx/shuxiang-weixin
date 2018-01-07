import Vue from 'vue'
import * as date from './lib/date'
import {QiNiuBaseUrl} from './config'

export const cdnFullUrl = function (fileKey, namespace) {
	return QiNiuBaseUrl + namespace + fileKey
}

export const timestampFormat = function (timestamp) {
  return date.formatTime(new Date(timestamp))
}

export const phoneNumberBeautiful = function (phoneNumber) {
	var numbers = phoneNumber.split('')
	function toString(numbers, count) {
		return numbers.splice(0, count).join('')
	}
	return toString(numbers, 3) + ' ' + toString(numbers, 4) + ' ' + toString(numbers, 4)
}

export const rmbFormat = function (num) {
  return '￥' + Number(num).toFixed(2)
}

Vue.filter('timestampFormat', timestampFormat)
Vue.filter('cdnFullUrl', cdnFullUrl)
Vue.filter('rmb', rmbFormat)
Vue.filter('phoneNumberBeautiful', phoneNumberBeautiful)

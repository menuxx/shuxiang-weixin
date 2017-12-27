import Vue from 'vue'
import {QiNiuBaseUrl} from './config'

export const cdnFullUrl = function (fileKey, namespace) {
	return QiNiuBaseUrl + namespace + fileKey
}

function formatDateTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const timestampFormat = function (timestamp) {
  return formatTime(new Date(timestamp))
}

export const phoneNumberBeautiful = function (phoneNumber) {
	var numbers = phoneNumber.split('')
	function toString(numbers, count) {
		return numbers.splice(0, count).join('')
	}
	return toString(numbers, 3) + ' ' + toString(numbers, 4) + ' ' + toString(numbers, 4)
}

Vue.filter('timestampFormat', timestampFormat)
Vue.filter('cdnFullUrl', cdnFullUrl)
Vue.filter('phoneNumberBeautiful', phoneNumberBeautiful)

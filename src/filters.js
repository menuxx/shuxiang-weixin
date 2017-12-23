import Vue from 'vue'
import {QiNiuBaseUrl} from './config'

export const cdnFullUrl = function (fileKey, namespace) {
	return QiNiuBaseUrl + namespace + fileKey
}

export const phoneNumberBeautiful = function (phoneNumber) {
	var numbers = phoneNumber.split('')
	function toString(numbers, count) {
		return numbers.splice(0, count).join('')
	}
	return toString(numbers, 3) + ' ' + toString(numbers, 4) + ' ' + toString(numbers, 4)
}

Vue.filter('cdnFullUrl', cdnFullUrl)
Vue.filter('phoneNumberBeautiful', phoneNumberBeautiful)

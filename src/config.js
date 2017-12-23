
const isProd = require('./env').isProd

var config = {}

if (isProd()) {
  config = {
    Domain: {
      AuthEntryPointUrl: "http://wxtest.qurenjia.com/wxauthcodetestredirect_2017",
      APIBaseUrl: "http://wxtest.qurenjia.com/api"
    }
  }
} else {
  config = {
    Domain: {
      AuthEntryPointUrl: "http://wxtest.qurenjia.com/wxauthcodetestredirect_2017",
      APIBaseUrl: "http://wxdev.qurenjia.com/api"
    }
  }
}

module.exports = {
  Domain: {
    AuthEntryPointUrl: config.Domain.AuthEntryPointUrl,
    APIBaseUrl: config.Domain.APIBaseUrl
  },
  WeiXin: {
    mpAppId: 'wx931d9dfbd5275c6e'
  },
  QiNiuBaseUrl: 'https://file.menuxx.com/',
  QiNiuImagePrefix: {
    item: 'images/items/',
    vipChannelAvatar: 'images/channel/avatar/'
  }
}

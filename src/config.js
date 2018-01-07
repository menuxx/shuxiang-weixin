
const isProd = require('./env').isProd

var config = {}

if (isProd()) {
  config = {
    Domain: {
      APIBaseUrl: 'http://wxtest.qurenjia.com/api',
      SiteBaseUrl: 'http://wxtest.qurenjia.com'
    }
  }
} else {
  config = {
    Domain: {
      AuthEntryPointUrl: "http://wxtest.qurenjia.com/wxauthcodetestredirect_2017",
      APIBaseUrl: "http://wxdev.qurenjia.com/api",
      SiteBaseUrl: "http://wxdev.qurenjia.com"
    }
  }
}

module.exports = {
  Domain: {
    AuthEntryPointUrl: config.Domain.AuthEntryPointUrl,
    APIBaseUrl: config.Domain.APIBaseUrl,
    SiteBaseUrl: config.Domain.SiteBaseUrl
  },
  WeiXin: {
    mpAppId: 'wx931d9dfbd5275c6e'
  },
  QiNiuBaseUrl: 'https://file.menuxx.com/',
  QiNiuImagePrefix: {
    item: 'images/items/',
    vipChannelAvatar: 'images/channel/avatar/',
    share: 'images/share/'
  }
}

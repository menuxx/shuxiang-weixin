
const isProd = require('./env').isProd
const isTest = require('./env').isTest
const isDev = require('./env').isDev

var config = {}

if ( isProd() ) {
  config = {
    Domain: {
      APIBaseUrl: 'https://wx.nizhuantech.com/api',
      SiteBaseUrl: 'https://wx.nizhuantech.com'
    }
  }
} else if ( isDev() ) {
  config = {
    Domain: {
      AuthEntryPointUrl: "https://wx.nizhuantech.com/wxauthcoderedirect_dev",
      APIBaseUrl: "http://wxdev.qurenjia.com/api",
      SiteBaseUrl: "http://wxdev.qurenjia.com"
    }
  }
} else if ( isTest() ) {
  config = {
    Domain: {
      AuthEntryPointUrl: "https://wx.nizhuantech.com/wxauthcoderedirect_test",
      APIBaseUrl: "http://wxtest.qurenjia.com/api",
      SiteBaseUrl: "http://wxtest.qurenjia.com"
    }
  }
} else {
  config = {
    Domain: {
      AuthEntryPointUrl: "https://wx.nizhuantech.com/wxauthcoderedirect_test",
      APIBaseUrl: "http://wxtest.qurenjia.com/api",
      SiteBaseUrl: "http://wxtest.qurenjia.com"
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
    mpAppId: 'wx3d87bb42c08a2c4b'
  },
  QiNiuBaseUrl: 'https://file.menuxx.com/',
  QiNiuImagePrefix: {
    item: 'images/items/',
    book: 'images/books/',
    vipChannelAvatar: 'images/channel/avatar/',
    share: 'images/share/'
  }
}

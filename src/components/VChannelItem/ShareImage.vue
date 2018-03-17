<template>
  <div class="sx-container">
    <div ref="renderBox" class="render-box"></div>
    <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>
    <div class="img-wrap">
      <img @click="onImageClick" ref="image" class="image" :src="imgSrc" />
    </div>
    <inline-loading v-show="showLoading"></inline-loading>
  </div>
</template>
<script>
const html = `
<div class="sx__container" id="__sxDOMImageContainer">
  <style type="text/css">
    html, body {
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .sx__container {
      background-color: #ffffff;
      color: #000;
      font-size: 36px;
      padding: 0 50px;
      width: 650px;
      height: 1334px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: space-around;
      font-family: "Helvetica Neue",Helvetica,"Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .sx__container .cover-image {
      display: block;
      width: 650px;
    }
    .sx__container .channel-owner {
      margin-bottom: 20px;
    }
    .sx__container .channel-owner .gift-txt {
      text-align: left;
      margin: 0;
      line-height: 65px;
      margin-bottom: 20px;
    }
    .sx__container .channel-owner .owner-name {
      font-size: 40px;
      text-align: right;
      margin: 0;
      font-weight: bold;
    }
    .sx__container .qrcode-wrap {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .sx__container .qrcode-wrap .qrcode-image {
      display: block;
      width: 200px;
      height: 200px;
      margin-bottom: 5px;
    }
    .sx__container .desc-info-sm {
      color: #444;
      font-size: 22px;
      text-align: center;
    }
  </style>
  <img class="cover-image" src="{{ itemCoverImageUrl }}" />
  <div class="channel-owner">
    <p class="gift-txt">
      {{ giftTxt }}
    </p>
    <p class="owner-name">---- {{ ownerName }}</p>
  </div>
  <div class="qrcode-wrap">
    <img class="qrcode-image" src="{{ channelItemQrcodeUrl }}" />
    <p class="desc-info-sm">{{ ownerName }}送出{{ stock }}本新书, 扫码领取</p>
  </div>
</div>`
  import * as api from '../../http/api'
  import config from '../../config'
  import {cdnFullUrl} from '../../filters'
  import qiniuUpload from '../../lib/qiniu-upload'
  import {makeSameOriginUrl, isAndroid, isIOS} from '../../lib/util'
  import {makeQrcodeDataUrl} from '../../lib/image'
  import 'blueimp-canvas-to-blob' // polyfily
  import {InlineLoading} from 'vux'

  export default {
    components: {InlineLoading},
    data() {
      return {
        showLoading: true,
        imgSrc: null
      }
    },
    beforeRouteEnter(to, from, next) {
      var {channelId} = to.params
      api.getVipChannelItem(channelId).then( res => {
        var channel = res.data
          next( vm => {
            vm.onDraw({
              itemCoverImageUrl: cdnFullUrl(channel.item.coverImage, config.QiNiuImagePrefix.item),
              ownerName: channel.ownerName,
              giftTxt: channel.giftTxt,
              stock: channel.stock,
              channelItemUrl: config.Domain.SiteBaseUrl + `?#/channels/${channelId}/item`
            })
          })
      })
    },
    methods: {
      onImageClick() {
        this.$wechat.previewImage({
          current: this.imgSrc,
          urls: [this.imgSrc]
        })
      },
      onDraw(data) {
        var self = this;
        require.ensure([], () => {
          var html2canvas = require('html2canvas')
          var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
          _html = _html
            .replace('{{ itemCoverImageUrl }}', makeSameOriginUrl(data.itemCoverImageUrl) )
            .replace('{{ ownerName }}', data.ownerName ).replace('{{ ownerName }}', data.ownerName )
            .replace('{{ giftTxt }}', data.giftTxt )
            .replace('{{ stock }}', data.stock )
            .replace('{{ channelItemQrcodeUrl }}', makeQrcodeDataUrl(data.channelItemUrl) )
          self.$refs.renderBox.innerHTML = _html
          try {
            html2canvas(document.querySelector("#__sxDOMImageContainer")).then( canvas => {
              canvas.toBlob( blob => { self.updateToQiniu(blob) }, 'image/jpeg', 0.8)
            }, err => {
              console.log(err.message, err.stack, err)
            })
          } catch (e) {
            console.error(e.message, e.stack, e)
          }
        })
      },
      updateToQiniu(blob) {
        qiniuUpload({
          file: blob,
          data: {
            keyPrefix: config.QiNiuImagePrefix.share
          },
          onProgress: () => {},
          onSuccess: (res) => {
            this.imgSrc = config.QiNiuBaseUrl + res.key
            this.showLoading = false
          },
          onError: (err) => {
            console.log(err)
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .render-box {
    position: absolute;
    right: 1000px;
    top: 1000px;
  }
  .sx-container {
    display: flex;
    justify-content: center;
  }
  .img-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .image {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }
  .canvas-hide {
    background-color: #fff;
    display: none;
  }
</style>

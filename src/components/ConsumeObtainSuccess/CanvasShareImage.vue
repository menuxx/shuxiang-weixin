<template>
  <div class="sx-container">
    <div ref="renderBox" class="render-box"></div>
    <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>
    <div class="img-wrap">
      <img @click="onImageClick" ref="image" class="image" :src="imgSrc" />
    </div>
  </div>
</template>
<script>
const html = `
<div class="sx__container2" id="__sxDOMImageContainer">
  <style type="text/css">
    html, body {
      background-color: #ffffff;
      padding: 0; margin: 0;
    }
    .sx__container2 {
      color: #000;
      width: 650px;
      height: 1334px;
      font-size: 36px;
      padding: 0 50px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: center;
      font-family: "Helvetica Neue",Helvetica,"Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .sx__container2 .avatar-next-to-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sx__container2 .avatar-next-to-section .avatar {
      width: 170px;
      border-radius: 50%;
    }
    .sx__container2 .avatar-next-to-section .channel-image {
      margin-right: 20px;
    }
    .sx__container2 .avatar-next-to-section .obtain-user {
      margin-left: 20px;
    }
    .sx__container2 .avatar-next-to-section .sx-exchange-icon {
      width: 100px;
      height: 100px;
    }
    .sx__container2 .slogan-text {
      margin: 10px 0;
    }
    .sx__container2 .ranking-section {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      color: #F3A536;
      font-size: 45px;
      margin-bottom: 10px;
    }
    .sx__container2 .ranking-section .ranking-icon {
      display: block;
      height: 100px;
      width: 100px;
    }
    .sx__container2 .item-image-wrap {
      padding: 10px 0;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
    }
    .sx__container2 .item-image-wrap .item-image {
      display: block;
      width: 550px;
      height: 550px;
    }
    .sx__container2 .slogan-text {
      text-align: center;
    }
    .sx__container2 .qrcode-wrap {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .sx__container2 .qrcode-wrap .desc-info-sm {
      margin: 0;
      font-size: 22px;
      text-align: center;
      color: #b5b1b5;
    }
    .sx__container2 .qrcode-wrap .qrcode-image {
      display: block;
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }
  </style>
  <div class="avatar-next-to-section">
    <img class="channel-image avatar" src="{{ ownerAvatarUrl }}">
    <img class="sx-exchange-icon" src="/ic_giftbook.png">
    <img class="obtain-user avatar" src="{{ userAvatarUrl }}">
  </div>

  <p class="slogan-text">{{ userName }}成功领取{{ ownerName }}送出的新书</p>

  <div class="ranking-section">
    <img class="ranking-icon" src="/ic_queue.png">第<span class="ranking-num">{{ queueNum }}</span>名
  </div>

  <div class="item-image-wrap">
    <img class="item-image" src="{{ itemCoverImageUrl }}">
  </div>

  <div class="qrcode-wrap">
    <img class="qrcode-image" src="{{ shopUrlQrcodeUrl }}" />
    <p class="desc-info-sm">扫码领取优惠券</p>
  </div>
</div>`
  import qiniuUpload from '../../lib/qiniu-upload'
  import config from '../../config'
  import 'blueimp-canvas-to-blob' // polyfily
  import {makeSameOriginUrl, isAndroid, isIOS} from '../../lib/util'
  import {makeQrcodeDataUrl} from '../../lib/image'
  import {InlineLoading} from 'vux'
  export default {
    components: {InlineLoading},
    data() {
      return {
        imgSrc: null
      }
    },
    methods: {
      onImageClick() {
        this.$wechat.previewImage({
          current: this.imgSrc,
          urls: [this.imgSrc]
        })
      },
      onDraw(data) {
        if ( isIOS() ) {
          this.onDrawIOS(data)
        } else if (isAndroid()) {
          this.onDrawAndroid(data)
        } else { // android
          this.onDrawAndroid(data)
        }
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
          },
          onError: (err) => {
            console.log(err)
          }
        })
      },
      onDrawIOS (data) {
        var self = this
        console.log('onDrawIOS')
        // 只有 ios 环境才执行相关依赖
        require.ensure([], () => {
          var html2canvas = require('html2canvas')
          var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
          _html = _html
            .replace('{{ shopUrlQrcodeUrl }}', makeQrcodeDataUrl(data.shopUrl))
            .replace('{{ itemCoverImageUrl }}', makeSameOriginUrl(data.itemCoverImageUrl) )
            .replace('{{ ownerName }}', data.ownerName )
            .replace('{{ queueNum }}', data.queueNum )
            .replace('{{ userName }}', data.userName )
            .replace('{{ userAvatarUrl }}', makeSameOriginUrl(data.userAvatarUrl) )
            .replace('{{ ownerAvatarUrl }}', makeSameOriginUrl(data.ownerAvatarUrl) )
          self.$refs.renderBox.innerHTML = _html
          try {
            html2canvas(document.querySelector("#__sxDOMImageContainer")).then( canvas => {
              canvas.toBlob( blob => { self.updateToQiniu(blob) }, 'image/png')
            }, err => {
              console.log(err)
            })
          } catch (e) {
            console.error(e)
          }
        })
      },
      onDrawAndroid(data) {
        var self = this
        console.log('onDrawAndroid')
        // 使用 延迟加载 ，只有 android 环境才加载相关依赖
        require.ensure([], (require) => {
          var rasterizeHTML = require('rasterizehtml')
          var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
          _html = _html
            .replace('{{ shopUrlQrcodeUrl }}', makeQrcodeDataUrl(data.shopUrl))
            .replace('{{ itemCoverImageUrl }}', makeSameOriginUrl(data.itemCoverImageUrl) )
            .replace('{{ ownerName }}', data.ownerName )
            .replace('{{ queueNum }}', data.queueNum )
            .replace('{{ userName }}', data.userName )
            .replace('{{ userAvatarUrl }}', makeSameOriginUrl(data.userAvatarUrl) )
            .replace('{{ ownerAvatarUrl }}', makeSameOriginUrl(data.ownerAvatarUrl) )
          rasterizeHTML.drawHTML(_html, self.$refs.canvas).then( result => {
            self.$refs.canvas.toBlob( blob => { self.updateToQiniu(blob) }, "image/png")
          }, err => {
            console.log('An error occured:', err);
          });
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
    height: 400px;
    width: 224px;
    display: flex;
    justify-content: center;
    .image {
      border: 0;
      width: 100%;
    }
  }
  .canvas-hide {
    display: none;
  }
</style>

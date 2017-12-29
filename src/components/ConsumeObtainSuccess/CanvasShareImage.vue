<template>
  <div class="page-container">
    <div ref="renderBox" class="render-box"></div>
    <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>
    <div class="img-wrap">
      <img @click="onImageClick" ref="image" class="image" :src="imgSrc" />
    </div>
  </div>
</template>
<script>
  import qiniuUpload from '../../lib/qiniu-upload'
const html = `
<div class="xs__container" id="__xsDOMImageContainer">
  <style type="text/css">
    html, body {
      background-color: #ffffff;
      padding: 0; margin: 0;
    }
    .xs__container {
      padding: 70px 0;
      width: 750px;
      height: 1194px;
      font-size: 30px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
    }
    .xs__container .avatar-next-to-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .xs__container .avatar-next-to-section .avatar {
      width: 170px;
      border-radius: 50%;
    }
    .xs__container .avatar-next-to-section .channel-image {
      margin-right: 20px;
    }
    .xs__container .avatar-next-to-section .obtain-user {
      margin-left: 20px;
    }
    .xs__container .avatar-next-to-section .sx-exchange-icon {
      width: 100px;
      height: 100px;
    }
    .xs__container .slogan-text {
      margin: 10px 0;
    }
    .xs__container .ranking-section {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      color: #F3A536;
      font-size: 45px;
      margin-bottom: 10px;
    }
    .xs__container .ranking-section .ranking-icon {
      display: block;
      height: 100px;
      width: 100px;
    }
    .xs__container .item-image-wrap {
      padding: 10px 0;
      display: flex;
      justify-content: center;
    }
    .xs__container .item-image-wrap .item-image {
      display: block;
      width: 550px;
      height: 550px;
    }
    .xs__container .slogan-text {
      text-align: center;
    }
    .xs__container .qrcode-wrap {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .xs__container .qrcode-wrap .desc-info-sm {
      margin: 0;
      font-size: 20px;
      text-align: center;
      color: #b5b1b5;
    }
    .xs__container .qrcode-wrap .qrcode-image {
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

  <p class="slogan-text">{{ userName }}成功领取{{ ownerName }}送出的新书《见识》</p>

  <div class="ranking-section">
    <img class="ranking-icon" src="/ic_queue.png">第<span class="ranking-num">{{ queueNum }}</span>名
  </div>

  <div class="item-image-wrap">
    <img class="item-image" src="{{ itemCoverImageUrl }}">
  </div>

  <div class="qrcode-wrap">
    <img class="qrcode-image" src="{{ shopUrlQrcodeUrl }}" />
    <p class="desc-info-sm">扫码领优惠券</p>
  </div>
</div>`
  import config from '../../config'
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
        console.log('onDrawIOS')
        // 只有 ios 环境才执行相关依赖
        require.ensure([], () => {
          var html2canvas = require('html2canvas')
          require('blueimp-canvas-to-blob') // polyfily
          var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
          _html = _html
            .replace('{{ shopUrlQrcodeUrl }}', makeQrcodeDataUrl(data.shopUrl))
            .replace('{{ itemCoverImageUrl }}', makeSameOriginUrl(data.itemCoverImageUrl) )
            .replace('{{ ownerName }}', data.ownerName )
            .replace('{{ queueNum }}', data.queueNum )
            .replace('{{ userName }}', data.userName )
            .replace('{{ userAvatarUrl }}', makeSameOriginUrl(data.userAvatarUrl) )
            .replace('{{ ownerAvatarUrl }}', makeSameOriginUrl(data.ownerAvatarUrl) )
          this.$refs.renderBox.innerHTML = _html
          try {
            html2canvas(document.querySelector("#__xsDOMImageContainer")).then( canvas => {
              this.$refs.renderBox.style.display = 'none';
              canvas.toBlob( blob => { this.updateToQiniu(blob) }, 'image/png')
            }, err => {
              console.log(err)
            })
          } catch (e) {
            console.error(e)
          }
        })
      },
      onDrawAndroid(data) {
        console.log('onDrawAndroid')
        // 使用 延迟加载 ，只有 android 环境才加载相关依赖
        require.ensure([], function(require){
          var rasterizeHTML = require('rasterizehtml')
          require('blueimp-canvas-to-blob') // polyfily
          var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
          _html = _html
            .replace('{{ shopUrlQrcodeUrl }}', makeQrcodeDataUrl(data.shopUrl))
            .replace('{{ itemCoverImageUrl }}', makeSameOriginUrl(data.itemCoverImageUrl) )
            .replace('{{ ownerName }}', data.ownerName )
            .replace('{{ queueNum }}', data.queueNum )
            .replace('{{ userName }}', data.userName )
            .replace('{{ userAvatarUrl }}', makeSameOriginUrl(data.userAvatarUrl) )
            .replace('{{ ownerAvatarUrl }}', makeSameOriginUrl(data.ownerAvatarUrl) )
          rasterizeHTML.drawHTML(_html, this.$refs.canvas).then( result => {
            this.$refs.canvas.toBlob( blob => { this.updateToQiniu(blob) }, "image/png")
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
  .page-container {
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

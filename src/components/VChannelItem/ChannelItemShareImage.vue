<template>
  <div class="xs-container">
    <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>
    <div class="img-wrap">
      <img @click="onImageClick" ref="image" class="image" :src="imgSrc" />
    </div>
  </div>
</template>
<script>
  const html = `
<div class="xs__container">
  <style type="text/css">
    html, body {
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .xs__container {
      color: #000;
      font-size: 36px;
      width: 630px;
      height: 1334px;
      padding: 0 60px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
    }
    .xs__container .cover-image {
      display: block;
      width: 630px;
      height: 630px;
    }
    .xs__container .channel-owner {
      margin-bottom: 20px;
    }
    .xs__container .channel-owner .gift-txt {
      text-align: left;
      margin: 0;
    }
    .xs__container .channel-owner .owner-name {
      text-align: right;
      margin: 0;
    }
    .xs__container .qrcode-wrap {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .xs__container .qrcode-wrap .qrcode-image {
      display: block;
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }
    .xs__container .desc-info-sm {
      color: #b5b1b5;
      font-size: 20px;
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
            .replace('{{ itemCoverImageUrl }}', data.itemCoverImageUrl )
            .replace('{{ ownerName }}', data.ownerName )
            .replace('{{ giftTxt }}', data.giftTxt )
            .replace('{{ stock }}', data.stock )
            .replace('{{ channelItemQrcodeUrl }}', makeQrcodeDataUrl(data.channelItemUrl) )
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
            .replace('{{ itemCoverImageUrl }}', data.itemCoverImageUrl )
            .replace('{{ ownerName }}', data.ownerName )
            .replace('{{ giftTxt }}', data.giftTxt )
            .replace('{{ stock }}', data.stock )
            .replace('{{ channelItemQrcodeUrl }}', makeQrcodeDataUrl(data.channelItemUrl) )
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

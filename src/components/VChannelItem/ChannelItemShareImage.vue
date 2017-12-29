<template>
  <div class="sx-container">
    <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>
    <div class="img-wrap">
      <img @click="onImageClick" ref="image" class="image" :src="imgSrc" />
    </div>
  </div>
</template>
<script>
  const html = `
<div class="page-container">
  <style type="text/css">
    html, body {
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .page-container {
      color: #000;
      font-size: 36px;
      width: 630px;
      height: 1334px;
      padding: 0 60px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
    }
    .cover-image {
      display: block;
      width: 630px;
      height: 630px;
    }
    .channel-owner {
      margin-bottom: 20px;
    }
    .channel-owner .gift-txt {
      text-align: left;
      margin: 0;
    }
    .channel-owner .owner-name {
      text-align: right;
      margin: 0;
    }
    .qrcode-wrap {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .qrcode-wrap .qrcode-image {
      display: block;
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }
    .desc-info-sm {
      color: #b5b1b5;
      font-size: 20px;
      text-align: center;
    }
  </style>
  <img class="cover-image" src="/static/raw_1512110740.jpeg" />
  <div class="channel-owner">
    <p class="gift-txt">
      当认清决定命运的因素之后，当了解古今中外各种被命运垂青的人的思维方式之后，能够用他们的指导自己行动一一相信，你就会有好命运。
    </p>
    <p class="owner-name">---- 雷军</p>
  </div>
  <div class="qrcode-wrap">
    <img class="qrcode-image" src="/static/7f960e2023fb5944592f615e20e4eef81.png" />
    <p class="desc-info-sm">雷军送出500本新书, 扫码领取</p>
  </div>
</div>`
  import config from '../../config'
  import {makeSameOriginUrl} from '../../lib/util'
  import {makeQrcodeDataUrl} from '../../lib/image'
  import * as rasterizeHTML from 'rasterizehtml'
  import dataURLtoBlob from 'blueimp-canvas-to-blob'
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
        var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
        _html = _html.replace('{{ shopUrlQrcodeUrl }}', makeQrcodeDataUrl(data.shopUrl))
          .replace('{{ itemCoverImageUrl }}', data.itemCoverImageUrl )
          .replace('{{ ownerName }}', data.ownerName )
          .replace('{{ queueNum }}', data.queueNum )
          .replace('{{ userName }}', data.userName )
          .replace('{{ userAvatarUrl }}', data.userAvatarUrl )
          .replace('{{ ownerAvatarUrl }}', data.ownerAvatarUrl )
        rasterizeHTML.drawHTML(_html, this.$refs.canvas).then( result => {
          try {
            this.$refs.canvas.toBlob( blob => {
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
            }, 'image/png', 0.95)
          } catch (e) {
            console.log(e)
          }
        }, err => {
          console.log('An error occured:', err);
        });
      }
    }
  }
</script>

<template>
  <div>
    <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>
    <img class="image" :src="imgSrc" />
  </div>
</template>
<script>
const html = `
<div class="sx-container">
  <style type="text/css">
    html, body {
      background-color: #ffffff;
      padding: 0; margin: 0;
    }
    .sx-container {
      padding: 70px 0;
      width: 750px;
      height: 1194px;
      font-size: 30px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
    }
    .avatar-next-to-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-next-to-section .avatar {
      width: 170px;
      border-radius: 50%;
    }
    .avatar-next-to-section .channel-image {
      margin-right: 20px;
    }
    .avatar-next-to-section .obtain-user {
      margin-left: 20px;
    }
    .avatar-next-to-section .sx-exchange-icon {
      width: 100px;
      height: 100px;
    }
    .slogan-text {
      margin: 10px 0;
    }
    .ranking-section {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      color: #F3A536;
      font-size: 45px;
    }
    .ranking-section .ranking-icon {
      display: block;
      height: 100px;
      width: 100px;
    }
    .item-image-wrap {
      display: flex;
      justify-content: center;
    }
    .item-image-wrap .item-image {
      display: block;
      width: 550px;
      height: 550px;
    }
    .slogan-text {
      text-align: center;
    }
    .qrcode-wrap {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .qrcode-wrap .desc-info-sm {
      margin: 0;
      font-size: 20px;
      text-align: center;
      color: #b5b1b5;
    }
    .qrcode-wrap .qrcode-image {
      display: block;
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }
  </style>
  <div class="avatar-next-to-section">
    <img class="channel-image avatar" src="{{ ownerImageUrl }}">
    <img class="sx-exchange-icon" src="/raw_1512368508.png">
    <img class="obtain-user avatar" src="{{ userAvatarUrl }}">
  </div>

  <p class="slogan-text">{{ userName }}成功领取{{ ownerName }}送出的新书《见识》</p>

  <div class="ranking-section">
    <img class="ranking-icon" src="/ic_queue.png"> 第 <span class="ranking-num">{{ queueNum }}</span> 名
  </div>

  <div class="item-image-wrap">
    <img class="item-image" src="{{ itemCoverImageUrl }}">
  </div>

  <div class="qrcode-wrap">
    <img class="qrcode-image" src="{{ shopUrlQrcodeUrl }}" />
    <p class="desc-info-sm">扫码领优惠券</p>
  </div>
</div>`
import {makeQrcodeUrl} from '../../lib/util'
import * as rasterizeHTML from 'rasterizehtml'
export default {
  data() {
    return {
      imgSrc: null
    }
  },
  methods: {
    onDraw(data) {
      console.log(makeQrcodeUrl(data.shopUrl))
      var _html = html.replace(/^ {8}/gm, "").replace(/^\n/g, "").replace(/\n +$/g, "\n")
      console.log( makeQrcodeUrl(encodeURIComponent(data.shopUrl)))
      _html = _html.replace('{{ shopUrlQrcodeUrl }}', makeQrcodeUrl(data.shopUrl))
        .replace('{{ itemCoverImageUrl }}', data.itemCoverImageUrl)
        .replace('{{ ownerName }}', data.ownerName)
        .replace('{{ queueNum }}', data.queueNum)
        .replace('{{ userName }}', data.userName)
        .replace('{{ userAvatarUrl }}', data.userAvatarUrl)
        .replace('{{ ownerAvatarUrl }}', data.ownerAvatarUrl)
      rasterizeHTML.drawHTML(_html, this.$refs.canvas).then( result => {
        console.log(result)
        this.imgSrc = result.image.src
      }, err => {
        console.log('An error occured:', err);
      });
    }
  }
}
</script>
<style scoped lang="scss">
  .image {
    width: 100%;
    height: 100%;
  }
  .canvas-hide {
    display: none;
  }
</style>

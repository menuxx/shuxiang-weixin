<template>
  <div class="sx__container" id="__sxDOMImageContainer">
    <div class="avatar-next-to-section">
      <img class="channel-image avatar" src="101.jpeg">
      <img class="sx-exchange-icon" src="/ic_giftbook.png">
      <img class="obtain-user avatar" src="201.jpeg">
    </div>
    <div class="slogan-text">111成功领取2222送出的新书</div>
    <div class="ranking-section">
      <img class="ranking-icon" src="/ic_queue.png">第<span class="ranking-num">2</span>名
    </div>
    <div class="item-image-wrap">
      <img class="item-image" src="/raw_1512110740.jpeg">
    </div>
    <div class="qrcode-wrap">
      <img class="qrcode-image" :src="qrcodeUrl" />
      <p class="desc-info-sm">扫码领取优惠券</p>
    </div>
  </div>
</template>
<script>
  import {makeQrcodeDataUrl} from '../../lib/image'
  export default {
    data() {
      return {
        qrcodeUrl: ''
      }
    },
    mounted() {
      this.qrcodeUrl = makeQrcodeDataUrl('asdasdasdasd')
    }
  }
</script>
<style>
  html, body {
    background-color: #ffffff;
    padding: 0; margin: 0;
  }
  .sx__container {
    padding: 40px 0;
    width: 750px;
    height: 1254px;
    font-size: 36px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    font-family: "Helvetica Neue",Helvetica,"Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .sx__container .avatar-next-to-section {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }
  .sx__container .avatar-next-to-section .avatar {
    width: 150px;
    height: 150px;
    min-height: 150px;
    min-width: 150px;
    border-radius: 50%;
  }
  .sx__container .avatar-next-to-section .channel-image {
    margin-right: 20px;
  }
  .sx__container .avatar-next-to-section .obtain-user {
    margin-left: 20px;
  }
  .sx__container .avatar-next-to-section .sx-exchange-icon {
    width: 100px;
    height: 100px;
  }
  .sx__container .slogan-text {
    margin-bottom: 30px;
    color: #000;
  }
  .sx__container .ranking-section {
    flex-basis: 100px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    color: #F3A536;
    font-size: 45px;
  }
  .sx__container .ranking-section .ranking-icon {
    display: block;
    height: 100px;
    width: 100px;
  }
  .sx__container .item-image-wrap {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
  .sx__container .item-image-wrap .item-image {
    display: block;
    width: 500px;
    height: 500px;
  }
  .sx__container .slogan-text {
    text-align: center;
  }
  .sx__container .qrcode-wrap {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .sx__container .qrcode-wrap .desc-info-sm {
    margin: 0;
    font-size: 22px;
    text-align: center;
    color: #b5b1b5;
  }
  .sx__container .qrcode-wrap .qrcode-image {
    display: block;
    width: 170px;
    height: 170px;
  }
</style>

<template>
  <div class="">
    <canvas id="myCanvas" width="535" height="953" class="myCanvas"></canvas>
    <img id="rawImg" width="535" height="953" crossorigin="anonymous">
  </div>
</template>
<script>

function createImage(url) {
  // rasterizeHTML.allinone.js
  var image  = new Image()
  image.src = url
  image.crossOrigin = 'anonymous';
  return new Promise(function (resolve, reject) {
    image.onload = resolve
    image.onerror = reject
  })
}

export default {
  data() {
    return {}
  },
  mounted() {

    this.$nextTick(function () {
      
      var myCanvas = document.getElementById("myCanvas")
      var rawImg = document.getElementById("rawImg")

      var ctx = myCanvas.getContext('2d')

      var avatarWidth = 100, avatarHeight = 100;

      var avatar1 = createImage("https://file.menuxx.com/images/share/raw_1435132853.jpeg")
      var avatar2 = createImage("https://file.menuxx.com/images/share/812837128323.jpeg")

      var exchange = createImage("https://file.menuxx.com/images/share/raw_1512368508.png")

      avatar1.then(function (e) {
        ctx.drawImage(e.target, 100, 20, avatarWidth, avatarHeight)
      })
      avatar2.then(function (e) {
        ctx.drawImage(e.target, 300, 20, avatarWidth, avatarHeight)
      })
      exchange.then(function (e) {
        ctx.drawImage(e.target, 200, 20, 50, 50)
      })

      ctx.font = '32px serif'
      ctx.fillText('张元一成功领取雷军送出的新书', 10, 200)

      var tag = createImage("https://file.menuxx.com/images/share/ic_queue.png")

      tag.then(function (e) {
        ctx.drawImage(e.target, 200, 260, 50, 50)
      })

      ctx.font = '32px serif'
      ctx.fillText('第31名', 260, 300)

      var itemPoster = createImage("https://file.menuxx.com/images/share/raw_1512110740.jpeg")

      itemPoster.then(function (e) {
        ctx.drawImage(e.target, 20, 300, 480, 500)
      })

      var qrcode = createImage("/static/7f960e2023fb5944592f615e20e4eef8.png")

      qrcode.then(function (e) {
        ctx.drawImage(e.target, 200, 800, 120, 120)
      })

      ctx.font = '16px serif'
      ctx.fillText('扫毛领取优惠券', 200, 940)

      setTimeout(function () {
        rawImg.src = myCanvas.toDataURL('image/jpg')
      }, 3000)

    })
  }
}
</script>
<style scoped lang="scss">
  #rawImg {
    display: block;
    width: 45vh;
    height: 80vh;
  }
  .myCanvas {
    display: none;
    width: 45vh;
    height: 80vh;
    background: #fff;
  }
</style>
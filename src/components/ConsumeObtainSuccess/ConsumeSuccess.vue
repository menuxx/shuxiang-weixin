<template>
    <div class="sx-container">

      <div ref="renderBox" class="render-box"></div>
      <canvas ref="canvas" class="canvas canvas-hide" width="750" height="1334"></canvas>

      <div v-transfer-dom>
        <x-dialog v-model="showWithMeShareImageDialog" :hide-on-blur="true" :dialog-style="{ backgroundColor: 'transparent', width: '13rem' }">
          <div class="share-image-wrap1">
            <div class="top-alert-text">长按保存相册分享到朋友圈</div>
            <img @click="onImageClick" ref="image" class="image" :src="imgSrc" />
          </div>
          <cell @click.native="showWithMeShareImageDialog = false" value-align="center">
            <img slot="title" width="20" style="color: #fff;" src="../../assets/close.png" />
          </cell>
        </x-dialog>
      </div>

      <div class="sx-top-bar" v-if="topBarShow">
        <div class="lp">
          <img class="logo-sm" src="../../assets/logo.png">
          <span class="brand-title">雪人读书</span>
        </div>
        <a @click="onSubscribeUs" class="btn-subscribe-us">关注查看抢书状态</a>
      </div>

      <div v-transfer-dom>
        <x-dialog :hide-on-blur="true" v-model="showSubscribeUsDialog" class="us-info">
          <div class="sx-dialog-header-bar">
            <span class="dialog-close" @click="showSubscribeUsDialog = false"></span>
          </div>
          <div class="us-info-wrap">
            <img class="qrcode" src="https://file.menuxx.com/images/qrcode_for_gh_485aedb4e817_344.jpg" />
            <span class="us-info-name">雪人读书</span>
            <span class="us-info-slogan">一群人解读一本好书</span>
          </div>
        </x-dialog>
      </div>

      <scroller height="-124" lock-x :scrollbar-x="false" :scrollbar-y="true" class="sx-share-section-scroll">

        <div class="sx-share-section-body">
          <div class="exchange-next-to-section">
            <img class="channel-image avatar" :src="myConsumeChannelOrderDetails.vChannel.ownerAvatarUrl">
            <img class="exchange-icon" src="../../assets/ic_giftbook-box.png" />
            <img class="obtain-user avatar" :src="myConsumeChannelOrderDetails.user.avatarUrl">
          </div>
          <p class="slogan-text">{{ myConsumeChannelOrderDetails.user.userName }}成功领取{{ myConsumeChannelOrderDetails.vChannel.ownerName }}送出的新书</p>
          <div class="ranking-section">
            <img class="ranking-icon" src="../../assets/ic_queue.png"> 第 <span class="ranking-num">{{ myConsumeChannelOrderDetails.queueNum }}</span> 名
          </div>
          <div class="item-image-wrap1">
            <img class="item-image" :src="myConsumeChannelOrderDetails.vChannel.item.coverImageUrl">
          </div>
        </div>

      </scroller>

      <box gap="10px 10px">
        <x-button @click.native="onShareVChannel" :disabled="shareBtnDisable" :show-loading="shareBtnDisable" type="primary">分享给好友</x-button>
      </box>

    </div>
</template>
<style lang="scss" scoped>
  @import "../../styles/xr-top-bar";
  @import '../../styles/qrcode-usinfo';
.sx-container {
  .sx-share-section-body {
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .exchange-next-to-section {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    .avatar {
      display: block;
      border-radius: 50%;
      height: 3rem;
      width: 3rem;
    }
    .exchange-icon {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
    }
    .avatar.channel-image {
      margin-right: 0.5rem;
    }
    .avatar.obtain-user {
      margin-left: 0.5rem;
    }
  }
  .slogan-text {
    font-size: 0.8rem;
    margin: 10px;
  }
  .ranking-section {
    margin-bottom: 10px;
    color: #F3A536;
    font-size: 0.9rem;
    .ranking-icon {
      vertical-align: middle;
      width: 1.5rem;
    }
    .ranking-num {
    }
  }
}
.item-image-wrap1 {
  padding: 20px 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  .item-image {
    width: 90%;
    display: block;
  }
}
// 分享图片
.share-image-wrap1 {
  background-color: #fff;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px;
  .top-alert-text {
    font-size: 0.6rem;
    color: #343034;
  }
  .image {
    display: block;
    width: 95%;
  }
}
.render-box {
  position: absolute;
  right: 1000px;
  top: 1000px;
}

.canvas-hide {
  background-color: #ffffff;
  display: none;
}
</style>
<script>
import config from '../../config'
import * as types from '../../sotre/types'
import * as auth from '../../http/auth'
import * as api from '../../http/api'
import isEmpty from 'is-empty'
import {cdnFullUrl} from '../../filters'
import {freeLoopRefId, getLoopRefId} from '../../obtainItem'
import router from '../../router'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { Scroller, Box, XButton, XDialog, TransferDomDirective as TransferDom, Cell } from 'vux'
import {RouteError} from '../../lib/MyError'
import qiniuUpload from '../../lib/qiniu-upload'
import {makeSameOriginUrl, isAndroid, isIOS} from '../../lib/util'
import {makeQrcodeDataUrl} from '../../lib/image'
import {InlineLoading} from 'vux'
import 'blueimp-canvas-to-blob' // polyfily
const html = `
<div class="sx__container" id="__sxDOMImageContainer">
  <style type="text/css">
  html, body {
    background-color: #ffffff;
    padding: 0; margin: 0;
  }
  .sx__container {
    background: #ffffff;
    padding: 70px 0 50px 0;
    width: 750px;
    height: 1194px;
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
    width: 130px;
    height: 130px;
    min-height: 130px;
    min-width: 130px;
    border-radius: 50%;
  }
  .sx__container .avatar-next-to-section .channel-image {
    margin-right: 20px;
  }
  .sx__container .avatar-next-to-section .obtain-user {
    margin-left: 20px;
  }
  .sx__container .avatar-next-to-section .sx-exchange-icon {
    width: 60px;
    height: 60px;
  }
  .sx__container .slogan-text {
    color: #000;
    margin-bottom: 10px;
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
    height: 65px;
    width: 65px;
  }
  .sx__container .item-image-wrap {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
  .sx__container .item-image-wrap .item-image {
    display: block;
    height: 650px;
    width: 650px;
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

  <div class="avatar-next-to-section">
    <img class="channel-image avatar" src="{{ ownerAvatarUrl }}">
    <img class="sx-exchange-icon" src="/ic_giftbook-box.png">
    <img class="obtain-user avatar" src="{{ userAvatarUrl }}">
  </div>

  <div class="slogan-text">{{ userName }}成功领取{{ ownerName }}送出的新书</div>

  <div class="ranking-section">
    <img class="ranking-icon" src="/ic_queue.png">第 <span class="ranking-num">{{ queueNum }}</span> 名
  </div>

  <div class="item-image-wrap">
    <img class="item-image" src="{{ itemCoverImageUrl }}">
  </div>

  <div class="qrcode-wrap">
    <img class="qrcode-image" src="{{ shopUrlQrcodeUrl }}" />
    <p class="desc-info-sm">扫码领取优惠券</p>
  </div>

</div>`

export default {
  directives: { TransferDom },
  components: { Scroller, Box, XButton, XDialog, Cell, InlineLoading },
  beforeRouteEnter(to, from, next) {
    var {orderId} = to.params
    api.getUserOrderDetails(orderId).then( res => {
      var order = res.data
      // 如果订单用户与当前用户不一致，就跳转到首页
      if ( order.userId !== auth.getUserInfo().id ) {
        var err = new RouteError(302, { name: 'channel_item', params: { channelId: order.channelId } }, `消费成功页面：当前用户ID与订单用户ID不一致`)
        next(err)
        return Promise.reject(err)
      } else {
        // 清除 refId
        var loopRefId = getLoopRefId(order.channelId)
        if ( isEmpty(order.queueNum) ) {
          api.getLoopChannelItemState(order.channelId, loopRefId).then( ({ data }) => {
            freeLoopRefId(order.channelId)
            next( vm  => {
              // 同步最新的名次序号
              res.data.queueNum = data.state.queueNum
              vm.consumeChannelOrderLoaded( res.data )
              vm.drawShareImage( res.data )
            })
          })
        } else {
          next( vm  => {
            vm.consumeChannelOrderLoaded( res.data )
            vm.drawShareImage( res.data )
          })
        }
      }
    }, err => {
      console.log(err)
      var _err = new RouteError(302, { name: 'index' }, err.message)
      next(_err)
    })
  },
  computed: {
    ...mapGetters(['myConsumeChannelOrderDetails'])
  },
  data() {
    return {
      showSubscribeUsDialog: false,
      imgSrc: null,
      topBarShow: true,
      showWithMeShareImageDialog: false,
      shareBtnDisable: true
    }
  },
  methods: {
      ...mapMutations({
        consumeChannelOrderLoaded: types.MY_CONSUME_ORDER_LOADED
      }),
      onImageClick() {
        this.$wechat.previewImage({
          current: this.imgSrc,
          urls: [this.imgSrc]
        })
      },
      onDraw(data, cb = ()=>{}) {
        var self = this
        console.log('onDrawIOS', data)
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
          html2canvas(document.querySelector("#__sxDOMImageContainer"), { useCORS: true }).then( canvas => {
            canvas.toBlob( blob => { self.updateToQiniu(blob, cb) }, 'image/jpeg', 0.8)
          }, err => {
            console.log(err)
          })
        })
      },
      updateToQiniu(blob, cb) {
        qiniuUpload({
          file: blob,
          data: {
            keyPrefix: config.QiNiuImagePrefix.share
          },
          onProgress: () => {},
          onSuccess: (res) => {
            this.imgSrc = config.QiNiuBaseUrl + res.key
            this.shareBtnDisable = false
            cb(this.imgSrc, res.key)
          },
          onError: (err) => {
            console.log(err)
          }
        })
      },
      drawShareImage(orderDetail) {
        // 如果图片已经生成功过 就不再生成
        if ( orderDetail.shareImage ) {
          this.imgSrc = cdnFullUrl(orderDetail.shareImage, config.QiNiuImagePrefix.share)
          this.shareBtnDisable = false
        } else {
          this.onDraw({
            queueNum: orderDetail.queueNum,
            shopUrl: orderDetail.vChannel.item.shopUrl,
            itemCoverImageUrl: cdnFullUrl(orderDetail.vChannel.item.coverImage, config.QiNiuImagePrefix.item),
            ownerName: orderDetail.vChannel.ownerName,
            userName: orderDetail.user.userName,
            userAvatarUrl: orderDetail.user.avatarUrl,
            ownerAvatarUrl: cdnFullUrl(orderDetail.vChannel.ownerAvatar, config.QiNiuImagePrefix.vipChannelAvatar)
          }, (url, key) => {
            api.updateOrderShareImage(orderDetail.id, key.replace(config.QiNiuImagePrefix.share, ''))
          })
        }
      },
      onShareVChannel() {
        this.showWithMeShareImageDialog = true
      },
      onSubscribeUs() {
        this.showSubscribeUsDialog = true
      }
  }
}
</script>

<template>
    <div class="sx-container">
      <div class="exchange-next-to-section">
        <img class="channel-image avatar" :src="myConsumeChannelOrderDetails.vChannel.ownerAvatarUrl">
        <img class="exchange-icon" src="../../assets/ic_giftbook.png" />
        <img class="obtain-user avatar" :src="myConsumeChannelOrderDetails.user.avatarUrl">
      </div>
      <p class="slogan-text">{{ myConsumeChannelOrderDetails.user.userName }}成功领取{{ myConsumeChannelOrderDetails.vChannel.ownerName }}送出的新书{{ myConsumeChannelOrderDetails.vChannel.item.name }}</p>
      <div class="ranking-section">
        <img class="ranking-icon" src="../../assets/ic_queue.png"> 第 <span class="ranking-num">{{ myConsumeChannelOrderDetails.queueNum }}</span> 名
      </div>
      <div class="item-image-wrap">
        <img class="item-image" :src="myConsumeChannelOrderDetails.vChannel.item.coverImageUrl">
      </div>
      <box gap="10px 10px">
        <x-button @click.native="onShareVChannel" type="primary">分享给好友</x-button>
      </box>
      <div v-transfer-dom>
        <x-dialog v-model="showWithMeShareImage" :hide-on-blur="true" :dialog-style="{ backgroundColor: 'transparent', width: '224px' }">
          <div class="share-image-wrap">
            <CanvasShareImage ref="shareImage" />
          </div>
          <cell @click.native="showWithMeShareImage = false" value-align="center">
            <img slot="title" width="20" style="color: #fff;" src="../../assets/close.png" />
          </cell>
        </x-dialog>
      </div>
    </div>
</template>
<style lang="scss" scoped>
.sx-container {
  margin-top: 10px;
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
    height: 3.8rem;
    width: 3.8rem;
  }
  .exchange-icon {
    display: block;
    width: 40px;
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
  font-size: 23px;
  .ranking-icon {
    vertical-align: middle;
    width: 2rem;
  }
  .ranking-num {
  }
}
.item-image-wrap {
  padding: 20px 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  .item-image {
    display: block;
    width: 300px;
    height: 300px;
  }
}
// 分享图片
.share-image-wrap {
  background-color: #fff;
}
</style>
<script>
import * as config from '../../config'
import * as types from '../../sotre/types'
import * as auth from '../../http/auth'
import isEmpty from 'is-empty'
import {cdnFullUrl} from '../../filters'
import router from '../../router'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import * as api from '../../http/api'
import { Box, XButton, XDialog, TransferDomDirective as TransferDom, Cell } from 'vux'
import CanvasShareImage from './CanvasShareImage'
import {RouteError} from '../../lib/MyError'
export default {
  directives: { TransferDom },
  components: { Box, XButton, XDialog, CanvasShareImage, Cell },
  beforeRouteEnter(to, from, next) {
    var {orderId} = to.params
    api.getOrderDetailsById(orderId).then( res => {
      var order = res.data
      // 如果订单用户与当前用户不一致，就跳转到首页
      if ( order.userId !== auth.getUserInfo().id ) {
        var err = new RouteError(302, { name: 'channel_item', params: { channelId: order.channelId } }, `消费成功页面：当前用户ID与订单用户ID不一致`)
        next(err)
        return Promise.reject(err)
      } else {
        next( vm  => {
          vm.consumeChannelOrderLoaded( res.data )
        })
      }
    }, err => {
      console.log(err)
    })
  },
  computed: {
    ...mapGetters(['myConsumeChannelOrderDetails'])
  },
  data() {
    return {
      showWithMeShareImage: false
    }
  },
  methods: {
      ...mapMutations({
        consumeChannelOrderLoaded: types.MY_CONSUME_ORDER_LOADED
      }),
      drawShareImage() {
        var details = this.myConsumeChannelOrderDetails
        this.$refs.shareImage.onDraw({
          queueNum: details.queueNum,
          shopUrl: details.vChannel.item.shopUrl,
          // itemCoverImageUrl: cdnFullUrl(details.vChannel.item.coverImage, config.QiNiuImagePrefix.item),
          itemCoverImageUrl: '/E46D8adKSD.jpg',
          ownerName: details.vChannel.ownerName,
          userName: details.user.userName,
          // userAvatarUrl: details.user.avatarUrl,
          userAvatarUrl: '/1111222.jpg',
          // ownerAvatarUrl: cdnFullUrl(details.vChannel.ownerAvatar, config.QiNiuImagePrefix.vipChannelAvatar)
          ownerAvatarUrl: '/1111222.jpg'
        })
      },
      onShareVChannel() {
        this.drawShareImage()
        this.showWithMeShareImage = true
      }
  }
}
</script>

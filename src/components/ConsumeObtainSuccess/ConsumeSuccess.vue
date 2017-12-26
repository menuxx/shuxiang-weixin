<template>
    <div class="sx-container">
      <div class="exchange-next-to-section">
        <img class="channel-image avatar" :src="myConsumeChannelOrderDetails.vChannel.ownerAvatarUrl">
        <i class="fa fa-exchange sx-exchange-icon" aria-hidden="true"></i>
        <img class="obtain-user avatar" :src="myConsumeChannelOrderDetails.user.avatarUrl">
      </div>
      <p class="slogan-text">{{ myConsumeChannelOrderDetails.user.userName }} 成功领取{{ myConsumeChannelOrderDetails.vChannel.ownerName }}送出的新书 {{ myConsumeChannelOrderDetails.vChannel.item.name }}</p>
      <div class="ranking-section">
        <img class="ranking-icon" src="../../assets/ic_queue.png"> 第 <span class="ranking-num">{{ myConsumeChannelOrderDetails.queueNum }}</span> 名
      </div>
      <div class="item-image-wrap">
        <img class="item-image" :src="myConsumeChannelOrderDetails.vChannel.item.coverImageUrl">
      </div>

      <x-button @click.native="onShareVChannel" type="primary">分享给好友</x-button>

      <div v-transfer-dom>
        <x-dialog v-model="showWithMeShareImage" :hide-on-blur="true" :dialog-style="{ backgroundColor: 'transparent' }">
          <div class="share-image-wrap">
            <CanvasShareImage />
          </div>
          <cell @click.native="onHideShareVChannel" primary="content" value-align="center">
            <img width="20" style="color: #fff;" src="../../assets/close.png" />
          </cell>
        </x-dialog>
      </div>

    </div>
</template>
<style lang="scss" scoped>
.sx-container {
  padding: 1rem 0.5rem;
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
  .sx-exchange-icon {
    font-size: 1.5rem;
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
  margin-bottom: 1rem;
}
.ranking-section {
  .ranking-icon {
    vertical-align: middle;
    width: 2rem;
  }
  .ranking-num {
    color: #e51c23;
  }
}
.item-image-wrap {
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
  import * as types from '../../sotre/types'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import {getOrderDetailsById} from '../../http/api'
import { XButton, XDialog, TransferDomDirective as TransferDom, Cell } from 'vux'
import CanvasShareImage from './CanvasShareImage'
export default {
  directives: {
    TransferDom
  },
  components: { XButton, XDialog, CanvasShareImage, Cell },
  beforeRouteEnter(to, from, next) {
    var {orderId} = to.params
    getOrderDetailsById(orderId).then( res => {
      next( vm  => {
        vm.consumeChannelOrderLoaded( res.data )
      })
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
      onShareVChannel() {
        this.showWithMeShareImage = true
      },
    onHideShareVChannel() {
      this.showWithMeShareImage = false
    }
  }
}
</script>

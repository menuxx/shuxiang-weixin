<template>
    <div class="sx-container">
      <div class="exchange-next-to-section">
        <img class="channel-image avatar" :src="channel.ownerAvatarUrl">
        <i class="fa fa-exchange sx-exchange-icon" aria-hidden="true"></i>
        <img class="obtain-user avatar" :src="user.avatarUrl">
      </div>
      <p class="slogan-text">{{ user.userName }} 成功领取{{ channel.ownerName }}送出的新书 {{ channel.itemName }}</p>
      <div class="ranking-section">
        <img class="ranking-icon" src="../../assets/ic_queue.png"> 第 <span class="ranking-num">{{ queueNum }}</span> 名
      </div>
      <div class="item-image-wrap">
        <img class="item-image" :src="channel.coverImageUrl">
      </div>

      <x-button @click="onShowChannel" type="primary">分享给好友</x-button>

      <div v-transfer-dom>
        <x-dialog v-model="showWithMeShareImage" class="us-info">
          <div class="share-image-wrap">
            <CanvasShareImage />
          </div>
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
</style>
<script>
// import { mapState } from 'vuex'
import { XButton, XDialog, TransferDomDirective as TransferDom } from 'vux'
import CanvasShareImage from './CanvasShareImage'
export default {
  directives: {
    TransferDom
  },
  components: { XButton, XDialog, CanvasShareImage },
  data() {
    return {
      showWithMeShareImage: true
    }
  },
  methods: {
  	  //
      onShowChannel() {

      }
  }
}
</script>

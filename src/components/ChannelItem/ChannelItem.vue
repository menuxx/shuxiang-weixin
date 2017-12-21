<template>

  <div class="sx-container">

    <img class="item-image" :src="coverImageUrl" :alt="item.name"/>

    <div class="item-author-section">
      <p class="item-author-text">{{ giftTxt }}</p>
      <span class="item-author-name">----{{ ownerName }}</span>
    </div>

    <div class="item-stock-section">
      剩余 <span class="item-stock-number">{{ remainNum }}</span> 本
    </div>

    <div class="obtain-partner-section">
      <span class="partner-section-title">他们都抢到了</span>
      <div class="partner-list-horizontal" v-for="partner in partners">
        <img class="user-avatar" :src="partner.avatarUrl" :alt="partner.userName" :key="partner.id"/>
        <span class="more-btn" @click="popupPartnerListView">更多</span>
      </div>
    </div>

    <div class="more-op-section">

      <a class="sx-btn-circle btn-sm-share" @click="onShareChannel">
        <i class="fa fa-share-alt-square" aria-hidden="true"></i>
        <span class="btn-sm-name">分享</span>
      </a>

      <a class="sx-btn-circle btn-sm-poster" @click="onShowPoster">
        <i class="fa fa-picture-o" aria-hidden="true"></i>
        <span class="btn-sm-name">海报</span>
      </a>

    </div>

    <a class="btn-block-primary" @click="requestObtain">
      「{{ ownerName }}」送出 {{ stock }} 本新书，马上抢读
    </a>

    <div v-transfer-dom>
      <!--  device screen height -->
      <popup v-model="showPartnerListView" height="100%">
        <div class="popup1">
          <PartnerListView :list="partners"/>
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
  import {QiNiuImagePrefix} from '../../config'
  import {mapState, mapMutations} from 'vuex'
  import isEmpty from 'is-empty'

  import PartnerListView from './PartnerList'
  import {Popup, TransferDomDirective as TransferDom } from 'vux'

  import {getLoopRefId, setLoopRefId, debounceLoopChannelState, loopChannelState} from '../../obtainItem'
  import store from '../../sotre'
  import * as types from '../../sotre/types'
  import http from '../../http'
  import * as api from '../../http/api'
  import {cdnFullUrl} from '../../filters'

  const States = {
    Fail: -1,
    NoObtain: 0,        // 未持有
    Obtain: 1,          // 已持有 单位消费
    ObtainConsumed: 2,  // 已消费 完成抢购
    ObtainConsumeAgain: 3,  // 再次消费
    Finish: 4,          // 抢完了，结束了
    FreeObtain: 5,       // 持有释放了
    ConsumeFail: 6       // 消费失败
  }

  /**
   * 渠道商品抢购
   */
  function channelItemObtain(channelId) {
    return http.get(api.ObtainChannelItem.replace('{channelId}', channelId)).then( res => {
      var {errCode, loopRefId, messageId, errMsg} = res.data
      // 满足轮询状态开始轮训
      if (errCode === 0 && !isEmpty(loopRefId) && !isEmpty(messageId)) {
        setLoopRefId(loopRefId)
        return debounceLoopChannelState(channelId, loopRefId).then(stateCode => {
          // 成功抢到
          if (stateCode === States.Obtain) {
            return States.Obtain
          } else {
            // 如果错误就终止轮询
            if ( stateCode === States.Fail ) {
              return States.Fail
            }
            // 只要未结束，只要没有已经消费国，就可以继续抢购
            if ( stateCode !== States.Finish || stateCode !== States.ObtainConsumeAgain || stateCode !== States.ObtainConsumed) {
              // 轮询知道有期待的结果返回
              return debounceLoopChannelFn()
            }
            // 否则返回最终状态码
            else {
              return stateCode
            }
          }
        })
      } else {
        return Promise.reject(new Error(errMsg))
      }
    })
  }

  export default {
    directives: { TransferDom },
    components: { PartnerListView, Popup },
    data() {
      return {
        showPartnerListView: false
      }
    },
    // 数据加载
    beforeRouteEnter (to, from, next) {
      var {channelId} = to.params
      channelId = parseInt(channelId, 10)
      if (Number.isInteger(channelId)) {
        Promise.all([
          api.getVipChannelItem(channelId)
        ])
        .then( res => {
          next(vm => {
            // 合并数据
            // 如果存在 长轮训 id 就继续之前的操作
            var loopRefId = getLoopRefId()
            if ( !isEmpty(loopRefId) ) {
              vm.continueLoopChannelState( loopRefId, channelId )
            }
            // mutation 更新 store 中的 channelItem
            vm.channelItemLoaded( res[0].data )
          })
        })
      } else {
        next(new Error('url参数错误'))
      }
    },
    computed: mapState({
      item: state => state.channelItem.item,
      channelId: state => state.channelItem.channelId,
      ownerAvatarUrl: state => cdnFullUrl(state.channelItem.ownerAvatar, QiNiuImagePrefix.vipChannelAvatar),
      giftTxt: state => state.channelItem.giftTxt, // 赠语
      stock: state => state.channelItem.stock,  // 库存
      remainNum: state => state.channelItem.remainNum,
      ownerName: state => state.channelItem.ownerName,
      partners: state => state.channelItem.partners
    }),
    methods: {
      ...mapMutations({
          channelItemLoaded: types.CHANNEL_ITEM_LOADED
      }),
      // 分享该渠道
      onShareChannel() {
        console.log("分享该渠道")
      },
      onShowPoster() {
        console.log("显示海报")
      },
      popupPartnerListView() {
        this.showPartnerListView = true
      },
      /**
       * 继续长轮训状态
       */
      continueLoopChannelState(loopRefId, channelId) {
        loopChannelState(loopRefId, channelId).then( stateCode => {
          this.requestObtainResult(stateCode)
        })
      },
      requestObtainResult(stateCode) {
        // 成功求购，可以进入消费状态
        // 成功抢购后会 持有 60 秒
        switch (stateCode) {
          // 成功持有
          case States.Obtain:
            // 提交状态
            this.$router.push({path: `/obtain_channel_item/${this.channelId}`})
            break;
          // 已消费(已经抢到了)
          case States.ObtainConsumed:
          case States.ObtainConsumeAgain:
            break;
          // 已经结束了
          case States.Finish:
            break;
          case States.Fail:
            console.log('发生了错误')
            break;
        }
      },

      // 开始抢购
      requestObtain() {
        channelItemObtain(this.channelId).then(stateCode => {
          this.requestObtainResult(stateCode)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./ChannelItem";
</style>

<template>

  <div class="sx-container">

    <scroller height="-62" lock-x :scrollbar-x="false" :scrollbar-y="true" class="sx-channel-section-scroll">

      <div class="sx-channel-section-body">

        <img class="item-image" :src="channelItem.item.coverImageUrl" :alt="channelItem.item.name"/>

        <div class="item-author-section">
          <p class="item-author-text">{{ channelItem.giftTxt }}</p>
          <span class="item-author-name">----{{ channelItem.ownerName }}</span>
        </div>

        <div class="item-stock-section">
          <span class="item-stock-number">
            <span class="item-stock-count">&nbsp;{{ channelItem.partnerCount }}&nbsp;</span>
            <span class="item-stock-sp">/</span>
            <span class="item-stock-total">{{ channelItem.stock }}</span>
          </span>
          <span class="item-unit">本</span>
        </div>

        <div class="obtain-partner-section" v-if="channelItem.partnerCount > 0">
          <span class="partner-section-title">他们都抢到了</span>
          <div class="partner-list-horizontal">
            <img class="user-avatar" v-for="partner in channelItem.partners" :src="partner.user.avatarUrl" :alt="partner.user.userName" :key="partner.user.id"/>
            <span class="more-btn" v-if="channelItem.partners.length > 1" @click="popupPartnerListView">更多</span>
          </div>
        </div>

      </div>

      <!--<div class="more-op-section">-->
      <!--<a class="sx-btn-circle btn-sm-share" @click="onShareChannel">-->
        <!--<i class="fa fa-share-alt-square" aria-hidden="true"></i>-->
        <!--<span class="btn-sm-name">分享</span>-->
      <!--</a>-->

      <!--<a class="sx-btn-circle btn-sm-poster" @click="onShowPoster">-->
        <!--<i class="fa fa-picture-o" aria-hidden="true"></i>-->
        <!--<span class="btn-sm-name">海报</span>-->
      <!--</a>-->
      <!--</div>-->

    </scroller>

    <box gap="10px 10px">
      <x-button @click.native="requestObtain" :type="primaryBtnType" class="request-obtain-btn" :disabled="primaryBtnDisable" :plain="primaryBtnDisable" :show-loading="primaryBtnLoading">{{ primaryBtnTxt }}</x-button>
    </box>

    <div v-transfer-dom>
      <!--  device screen height -->
      <popup v-model="showPartnerListView" height="100%">
        <div class="popup">
          <div class="popup-tips">
            已领取 {{ channelItem.partnerCount }} 本，共{{ channelItem.stock }}本
            <a class="close-btn" @click="showPartnerListView = false">
              <i class="fa fa-times-circle-o" aria-hidden="true"></i>
            </a>
          </div>
          <PartnerListView :data="channelItem"/>
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
  import {QiNiuImagePrefix} from '../../config'
  import {mapState, mapMutations} from 'vuex'
  import isEmpty from 'is-empty'
  import {States} from '../../obtainItem'
  import PartnerListView from './PartnerList'
  import { Scroller, Box, XButton, Popup, TransferDomDirective as TransferDom } from 'vux'

  import {getLoopRefId, setLoopRefId, debounceLoopChannelState, loopChannelState} from '../../obtainItem'
  import store from '../../sotre'
  import * as types from '../../sotre/types'
  import http from '../../http'
  import * as api from '../../http/api'
  import {cdnFullUrl} from '../../filters'

  function getTitleTxt(channelItem) {
    return channelItem.ownerName + '送出' + channelItem.stock + '本新书，马上抢读'
  }

  export default {
    directives: { TransferDom },
    components: { Scroller, Box, XButton, PartnerListView, Popup },
    data() {
      return {
        primaryBtnType: 'primary',
        primaryBtnLoading: false,
        primaryBtnDisable: true,
        primaryBtnTxt: '',
        showPartnerListView: false
      }
    },
    // 数据加载
    beforeRouteEnter (to, from, next) {
      var {channelId} = to.params
      Promise.all([
        api.getVipChannelItem(channelId),
        api.getVChannelOrders(channelId),
        api.getMyChannelOrder(channelId)
      ])
      .then( res => {
        next(vm => {
          var channelItem = res[0].data
          var partner = res[1].data
          var order = res[2].data
          var title = getTitleTxt(channelItem)
          vm.updateTitle(title)
          // mutation 更新 store 中的 channelItem
          vm.channelPartnerLoaded( partner )
          vm.channelItemLoaded( channelItem )
          // 合并数据
          // 如果存在 长轮训 id 就继续之前的操作
          var loopRefId = getLoopRefId(channelId)
          if ( !isEmpty(loopRefId) ) {
              vm.continueLoopChannelState( loopRefId, channelId )
          }
          // 如果库存已抢完
          if ( partner.count === channelItem.stock || Date.now() > channelItem.endTime ) {
             vm.primaryBtnDisable = true
             vm.primaryBtnLoading = false
             vm.primaryBtnTxt = '很遗憾，已经被抢光'
             vm.primaryBtnType = ''
          } else {
            // 没有订单 id 就说明，该用户没有参与过，可以抢
            if ( isEmpty(order.id) ) {
              vm.primaryBtnDisable = false
              vm.primaryBtnTxt = title
              vm.primaryBtnType = 'primary'
            } else if ( !isEmpty(order.id) && !isEmpty(order.queueNum) )  {
              vm.primaryBtnDisable = true
              vm.primaryBtnLoading = false
              vm.primaryBtnTxt = '已抢到'
              vm.primaryBtnType = ''
              vm.$router.replace({ name: 'consume_obtain_success', params: { orderId: order.id } })
            }
          }
        })
      })
    },
    computed: mapState({
      channelId: state => state.channelItem.channelId,
      channelItem: state => state.channelItem
    }),
    methods: {
      ...mapMutations({
          updateTitle: types.TITLE_UPDATE,
          channelItemLoaded: types.CHANNEL_ITEM_LOADED,
          channelPartnerLoaded: types.CHANNEL_PARTNER_LOADED
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
        this.primaryBtnDisable = true
        this.primaryBtnLoading = true
        this.channelItemObtain(channelId).then( stateCode => {
          console.log('requestObtain 2 stateCode : ' + stateCode)
          this.requestObtainResult(stateCode)
        })
      },
      requestObtainResult(stateCode) {
        // 成功求购，可以进入消费状态
        // 成功抢购后会 持有 60 秒
        switch (stateCode) {
          // 成功持有
          case States.Obtain:
            console.log('States.Obtain')
            // 提交状态
            this.$router.push({ name: 'obtain_channel_item', params: { channelId: this.channelId } })
            break;
          // 已消费(已经抢到了)
          case States.ObtainConsumed:
          case States.ObtainConsumeAgain:
            this.$vux.toast.show({ text: '已抢到' })
            break;
          // 已经结束了
          case States.Finish:
            this.$vux.alert('来晚了，已经结束了')
            break;
          case States.Fail:
            console.log('发生了错误')
            break;
        }
      },
      /**
       * 渠道商品抢购
       */
      channelItemObtain (channelId) {
        return http.get(api.ObtainChannelItem.replace('{channelId}', channelId)).then( res => {
          var {errCode, loopRefId, messageId, errMsg} = res.data
          // 满足轮询状态开始轮训
          if (errCode === 1 && !isEmpty(loopRefId) && !isEmpty(messageId)) {
            setLoopRefId(channelId, loopRefId)
            return debounceLoopChannelState(channelId, loopRefId, (stateCode, next) => {
              console.log('loop stateCode: ', stateCode)
              // 如果已经过期，就重新发起请求
              if ( stateCode === States.FreeObtain ) {
                next(false) // 中断上一次循环, 开始新的循环
                return this.channelItemObtain(channelId)
              }
              // 成功抢到
              if (stateCode === States.Obtain || stateCode === States.Fail || stateCode === States.Finish || stateCode === States.ObtainConsumeAgain || stateCode === States.ObtainConsumed ) {
                return next(stateCode)
              } else {
                // 只要未结束，只要没有已经消费国，就可以继续抢购
                if ( stateCode === States.NoObtain ) {
                  // 轮询直到有期待的结果返回，否则继续轮训
                  // 不调用 next 会导致 loopFn 一至被调用
                  return;
                }
                // 否则返回最终状态码
                else {
                  return next(stateCode)
                }
              }
            })
          } else {
            return Promise.reject(new Error(errMsg))
          }
        })
      },
      // 开始抢购
      requestObtain() {
        this.primaryBtnDisable = true
        this.primaryBtnLoading = true
        this.channelItemObtain(this.channelId).then(stateCode => {
          console.log('requestObtain 1 stateCode : ' + stateCode)
          this.requestObtainResult(stateCode)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "VChannelItem";
  .sx-container {
    height: 100%;
  }
  .sx-channel-section-body {
    min-height: 660px;
    margin: 10px 0;
  }
  .popup-tips {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    padding: 0.1rem 0.5rem;
    border-bottom: 1px solid #ccc;
    .close-btn {
      font-size: 1.5rem;
    }
  }
</style>

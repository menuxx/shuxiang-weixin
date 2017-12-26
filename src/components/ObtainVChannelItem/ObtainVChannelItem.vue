<template>
  <div class="sx-container">

    <div v-transfer-dom>
      <x-dialog v-model="showAddAddressDialog" style="padding: 10px;">
        <cell title="添加收货地址" @click.native="showAddAddressDialog = false">
          <img width="20" style="display:block;margin-right:5px;" src="../../assets/close-empty.svg" />
        </cell>
        <NewAddressPanel @submit="onNewAddressSubmit" />
      </x-dialog>
    </div>

    <div class="sx-address-section">
      <div class="sx-address-item" v-if="isShowAddressSection">
        <div class="sx-address-item_view">
          <div class="p1">
            <div class="line1">
              <span class="receiver-name">{{ receiver.receiverName }}</span>
              <span class="phone-number">{{ receiver.phoneNumber }}</span>
            </div>
            <div class="line2">
              {{ receiver.province }}{{ receiver.city }}{{ receiver.county }}{{ receiver.detailInfo }}
            </div>
          </div>
          <div class="p2">
            <a class="sx-btn-apply" @click="onChooseMoreAddress">
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <group gutter="0">
      <cell @click.native="onChooseSysAddress" :title="addressLabels.sys" is-link :border-intent="false">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/plus.svg" />
      </cell>
      <cell @click.native="onChooseWxAddress" :title="addressLabels.weixin" is-link :border-intent="false" :disabled="false" :is-loading="wxChooseBtnLoading">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/wechat.svg" />
      </cell>
    </group>

    <div class="book-list-1" v-for="i in [1]" :key="i">
      <div class="book-item">
        <div class="col1">
          <img class="item-thumb" :src="item.coverImageUrl">
        </div>
        <div class="col2">
          <h4 class="item-name">{{ item.name }}</h4>
          <p class="item-desc-text">{{ item.describe }}</p>
        </div>
        <div class="col3">
          <a class="attach-line">限 1 本</a>
        </div>
      </div>
    </div>

    <divider class="sx-spl">立即领取</divider>
    <x-button @click.native="requestConsumeObtain" type="primary" :show-loading="false">「{{ ownerName }}」送出 {{ stock }} 本新书，马上抢读</x-button>

  </div>

</template>
<style lang="scss" scoped>
@import '../EditAddress/EditAddress';
@import "../../styles/book-list1";
.sx-address-item {
  padding: 0;
  .p2 {
    .sx-btn-apply {
      display: block;
      height: 2rem;
      width: 2rem;
      line-height: 2rem;
      text-align: center;
      color: #38f;
    }
  }
}
.sx-address-section:after {
  content: ' ';
  display: block;
  width: 100%;
  height: 2px;
  background-image: url(../../assets/sp.png);
  background-size: 34px 2px;
}
.choose-address-btn {
  .btn-item {
    padding: 0.5rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 0.8rem;
    border-bottom: 1px solid #ccc;
  }
  .sx-btn-icon {
    font-size: 1.1rem;
    margin-right: 0.5rem;
  }
  .sx-btn-icon-plus {
    color: #d4237a;
  }
  .sx-btn-icon-weixin {
    color: #1AAD19;
  }
}
.sx-container {

}
// 分割线
.sx-spl {
  font-size: 0.7rem;
}
</style>
<script>
// 持有项目
import { XButton, CellBox,  Grid, GridItem, Divider, Cell, Group, XDialog, TransferDomDirective as TransferDom } from 'vux'
import NewAddressPanel from '@/components/EditAddress/NewAddressPanel'
import { mapState, mapMutations } from 'vuex'
import * as types from '../../sotre/types'
import * as api from '../../http/api'
import isEmpty from 'is-empty'
import {getLoopRefId, setLoopRefId, debounceLoopChannelState} from '../../obtainItem'

function getAddress(addressId) {
  if ( isEmpty(addressId) || isNaN(addressId) ) {
    return api.getMyPrimaryAddress()
  } else {
    return api.getMyAddress(addressId)
  }
}

export default {
  directives: { TransferDom },
  components : { XButton, Divider, Grid, GridItem, Cell, CellBox, Group, XDialog, NewAddressPanel },
  data() {
    return {
      isShowAddressSection: false,
      addressLabels: {
        sys: '手动添加收货地址',
        weixin: '一键获取微信地址'
      },
      showAddAddressDialog: false,
      wxChooseBtnLoading: false
    }
  },
  computed: mapState({
    channelId: state => state.channelItem.channelId,
    item: state => state.channelItem.item,
	  receiver: state => state.channelOrder.receiver,
    ownerName: state => state.channelItem.ownerName,
    stock: state => state.channelItem.stock  // 库存
  }),
  /**
   * 1. 先过去用户默认地址(primary)
   */
  beforeRouteEnter (to, from, next) {
    var {channelId} = to.params
    var {addressId} = to.query
    channelId = parseInt(channelId, 10)
    console.log('beforeRouteEnter:addressId', addressId)
    Promise.all([
      api.getVipChannelItem(channelId),
      getAddress(addressId)
    ]).then(res => {
      var channelItem = res[0].data
      var receiverAddress = res[1].data
      // 如果能够获取到地址， 就直接填充改地址
        next(vm => {
          vm.isShowAddressSection = !isEmpty(receiverAddress.phoneNumber) && !isEmpty(receiverAddress.receiverName)
          vm.updateReceiver( receiverAddress );
          vm.channelItemLoaded( channelItem );
        })
    }, err => {
      console.log(err)
      // 显示地址选择
      next(vm => {
        vm.onChooseSysAddress()
      })
    })
  },
  methods: {
    ...mapMutations({
      channelItemLoaded: types.CHANNEL_ITEM_LOADED,
      updateReceiver: types.MY_RECEIVER_ADDRESS_UPDATE
    }),
    onChooseMoreAddress() {
      this.$router.push({ name: 'user_address', query: { redirectPath: this.$router.currentRoute.fullPath } })
    },
    onChooseSysAddress() {
      this.showAddAddressDialog = true
    },
    onChooseWxAddress() {
      /**
       * 返回值 说明
       errMsg 获取编辑收货地址成功返回“openAddress:ok”。
       userName 收货人姓名。
       postalCode 邮编。
       provinceName 国标收货地址第一级地址（省）。
       cityName 国标收货地址第二级地址（市）。
       countryName 国标收货地址第三级地址（国家）。
       detailInfo 详细收货地址信息。
       nationalCode 收货地址国家码。
       telNumber 收货人手机号码。
       */
      this.wxChooseBtnLoading = true
      this.$wechat.openAddress({
        success: (res) => {
          if ( res.errMsg === "openAddress:ok" ) {
            this.addNewAddress({
              city: res.cityName,
              country: res.countryName,
              province: res.provinceName,
              postalCode: res.postalCode,
              receiverName: res.userName,
              detailInfo: res.detailInfo,
              phoneNumber: res.telNumber
            }).then(res => {
              if ( !isEmpty(res.id) ) {
                this.wxChooseBtnLoading = false
                vm.updateReceiver( res );
                this.$vux.toast.show({ text: '添加完成' })
              } else {
                this.$vux.toast.show({
                  text: '添加出现问题: ' + res.message
                })
              }
            })
          } else {
            console.log("返回了不正确的状态", res)
          }
        },
        cancel: () => {
          this.wxChooseBtnLoading = false
          console.log("取消了地址选择")
        }
      })
    },
    /**
     * 档地址被创建的时候
     */
    onNewAddressSubmit(address) {
      api.addNewAddress(address).then( res => {
        var address = res.data
        if ( !isEmpty(address.id) ) {
          this.updateReceiver(address)
          // 保存成功关闭 dialog
          this.showAddAddressDialog = false
        } else {
          this.$vux.toast.text('地址创建失败', 'middle')
        }
      })
    },
    requestConsumeObtain() {
      api.requestConsumeObtain(this.channelId, this.receiver.id).then( res => {
        var {code, orderId, wxPayment} = res.data
        console.log(res)
        switch (code) {
          // 不需要支付
          case 1:
            // 跳转到最后一个页面
            this.$router.push({ name: 'consume_obtain_success', params: { orderId } })
            break;
          // 需要支付，拉起回调
          case 2:
            try {
              this.$wechat.chooseWXPay({
                appId: wxPayment.appId,
                timestamp: wxPayment.timeStamp,
                nonceStr: wxPayment.nonceStr,
                'package': wxPayment.packageValue,
                signType: wxPayment.signType,
                paySign: wxPayment.paySign,
                success: (res) => {
                  if ( res.errMsg === 'chooseWXPay:ok' ) {
                    // 支付成功
                    this.$router.push( { name: 'consume_obtain_success', params: { orderId } } )
                  }
                },
                fail: (err) => {
                  console.error(err)
                  this.$vux.toast.text(err.errMsg, 'middle')
                },
                cancel: () => {
                  // 用户取消支付
                },
                complete: () => {
                  console.log('支付完成')
                }
              })
            } catch(e) {
              console.error(e)
            }
            break;
        }
      })
    }
  }
}
</script>

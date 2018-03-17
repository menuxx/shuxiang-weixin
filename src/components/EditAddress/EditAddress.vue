<template>
    <div class="page-container">

      <div v-transfer-dom>
        <x-dialog v-model="showEditAddressDialog" style="padding: 10px;">
          <cell :title="editAddressDialogTitle" @click.native="showEditAddressDialog = false">
            <img width="20" style="display:block;margin-right:5px;" src="../../assets/close-empty.svg" />
          </cell>
          <NewAddressPanel ref="editAddressPanel" @submit="onAddressDataSubmit" />
        </x-dialog>
      </div>

      <scroller height="-62" lock-x :scrollbar-x="false" :scrollbar-y="true" class="sx-address-list-scroll">
        <div class="sx-address-list">
            <div class="sx-address-item" v-for="(address, index) in addresses" :key="address.id">
              <div class="sx-address-item_view">
                <div class="p1">
                  <div class="line1">
                    <span class="receiver-name">{{ address.receiverName }}</span>
                    <span class="phone-number">{{ address.phoneNumber | phoneNumberBeautiful }}</span>
                  </div>
                  <div class="line2">
                    {{ address.province }}{{ address.city }}{{address.country}}{{address.detailInfo}}
                  </div>
                </div>
                <div class="p2">
                  <x-button v-if="showApplyBtn" @click.native="onApplyAddress(index)" mini plain type="primary">使用</x-button>
                </div>
              </div>
              <div class="__bottom-bar">
                <check-icon type="plain" @click.native="onAddressPrimary(index)" :value="address.primary == 1">
                  {{  address.primary == 1 ? '' : '设置默认'  }}
                </check-icon>
                <div class="bar-btn-group">
                  <a class="btn-item-edit" @click="onShowEditAddressDialog(index)">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                    编辑
                  </a>
                  <a class="btn-item-remove" @click="onDelAddress(index)">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    删除
                  </a>
                </div>
              </div>
            </div>
        </div>
      </scroller>

      <box gap="10px 10px" class="sx-bottom-bar">
        <flexbox justify="space-between" wrap="nowrap">
          <flexbox-item>
            <x-button :gradients="['#FF5E3A', '#FF9500']" @click.native="onShowAddNewAddressDialog">
              <i class="fa fa-plus" aria-hidden="true"></i> 手动添加
            </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="onAddNewAddressFromWeiXin">
              <i class="fa fa-weixin" aria-hidden="true"></i> 微信导入
            </x-button>
          </flexbox-item>
        </flexbox>
      </box>

    </div>
</template>
<style lang="scss" scoped>
  @import './EditAddress';
  .page-container {
    height: 100%;
  }
  .sx-address-list-scroll {
  }
  .sx-bottom-bar {
  }
</style>
<script>
  import Vue from 'vue'
	import { Box, Scroller ,Cell, CheckIcon, Flexbox, FlexboxItem, XButton, XDialog, TransferDomDirective as TransferDom } from 'vux'
  import NewAddressPanel from '@/components/EditAddress/NewAddressPanel'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import * as api from '../../http/api'
  import * as types from '../../sotre/types'
  import isEmpty from 'is-empty'
  import {addressRedirectTo, lookupAddressToPath} from '../../weixin'
  import qs from 'querystring'
  import InlineLoading from "../../../node_modules/vux/src/components/inline-loading/index.vue";

	export default {
    directives: { TransferDom },
		components: {
      InlineLoading,
      Box, Scroller ,Cell, CheckIcon, Flexbox, FlexboxItem, XButton, XDialog, NewAddressPanel },
		data() {
			return {
			  showApplyBtn: false,
			  editAddressDialogTitle: '',
        showEditAddressDialog: false
      }
		},
    beforeRouteEnter (to, from, next) {
      api.getMyAddresses().then( res => {
        next(vm => {
          vm.showApplyBtn = !isEmpty(lookupAddressToPath())
          vm.myAddressLoaded(res.data)
        })
      })
    },
    computed: {
      ...mapState({
        addresses: state => state.addresses
      })
    },
		methods: {
      ...mapActions(['addNewAddress', 'delAddress', 'setPrimaryAddress', 'updateAddress']),
      ...mapMutations({
        myAddressLoaded: types.MY_ADDRESSES_LOADED
      }),
			onApplyAddress(index) {
        var address = this.addresses[index]
        this.$router.push({ path: addressRedirectTo({ addressId: address.id }) })
      },
			onAddNewAddressFromWeiXin() {
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
                  this.$vux.toast.show({
                    text: '添加完成'
                  })
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
            console.log("取消了地址选择")
          }
        })
      },
      onShowAddNewAddressDialog() {
        this.editAddressDialogTitle = "添加收货地址"
        this.$refs.editAddressPanel.setAddressData(null)
        this.showEditAddressDialog = true
      },
			// 添加自定义地址
      onAddressDataSubmit({address, type}) {
        if ( type === 0 ) {
          // type = 2 属于 value 为空后 更新
          this.addNewAddress(address).then(res => {
            if ( !isEmpty(res.id) ) {
              this.showEditAddressDialog = false
              this.$vux.toast.show({
                text: '添加完成'
              })
            } else {
              this.$vux.toast.show({
                text: '添加出现问题: ' + res.message
              })
            }
          })
          // type = 1 属于 value 被填充后 更新
        } else if ( type === 1 ) {
          this.updateAddress(address).then(res => {
            if ( res.code === 1 ) {
              this.showEditAddressDialog = false
              this.$vux.toast.show({
                text: '更新完成'
              })
            } else {
              this.$vux.toast.show({
                text: '更新出现问题: ' + res.message
              })
            }
          })
        }
			},
      onShowEditAddressDialog(index) {
        this.$refs.editAddressPanel.setAddressData( this.addresses[index])
        this.editAddressDialogTitle = "编辑收货地址"
        this.showEditAddressDialog = true
      },
      // 是指默认地址
      onAddressPrimary(index) {
        var address = this.addresses[index]
        this.setPrimaryAddress(address.id).then( res => {
          if ( res.code > 0 ) {
            console.log("设置完成")
          } else {
            this.$vux.toast.show({
              text: '设置错误: ' + res.data.msg
            })
          }
        })
      },
      // 删除地址
			onDelAddress(index) {
        var address = this.addresses[index]
        this.$vux.confirm.show({
          content: "确认删除改地址吗?",
          confirmText: '删除',
          onCancel : () => {
            console.log("取消了删除")
          },
          onConfirm: () => {
            this.delAddress(address.id).then(res => {
              if ( res.code === 1 ) {
                this.$vux.toast.show({
                  text: '删除完成'
                })
              } else {
                this.$vux.toast.show({
                  text: '删除出现错误'
                })
              }
            })
          }
        })

			}
		}
	}
</script>

<template>
    <div class="sx-container">

        <div class="sx-address-list">

            <div class="sx-address-item" v-for="address in addresses" :key="address.id">
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
                        <a class="sx-btn-apply" @click="onApplyAddress">使用</a>
                    </div>
                </div>
                <div class="sx-bottom-bar">
                    <check-icon>设置默认</check-icon>
                    <div class="bar-btn-group">
                        <a class="btn-item-edit" @click="onEditAddress(index)">
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

        <flexbox>
            <flexbox-item>
                <x-button type="warn" @click="onAddNewAddress">
                    <i class="fa fa-plus" aria-hidden="true"></i> 手动添加
                </x-button>
            </flexbox-item>
            <flexbox-item>
                <x-button type="primary" @click="onAddNewAddressFromWeiXin">
                    <i class="fa fa-weixin" aria-hidden="true"></i> 微信导入
                </x-button>
            </flexbox-item>
        </flexbox>

    </div>
</template>
<style lang="scss" scoped>
    @import './EditAddress';

    .sx-address-list {

    }
</style>
<script>
	import {CheckIcon, Flexbox, FlexboxItem, XButton} from 'vux'

	export default {
		components: { CheckIcon, Flexbox, FlexboxItem, XButton },
		data() {
			return {}
		},
		methods: {
			onApplyAddress() {

      },
			onAddNewAddressFromWeiXin() {

      },
			//
			onAddNewAddress() {

			},
      onUpdateAddress() {

      },
      //
			onEditAddress() {

			},
      // 删除地址
			onDelAddress() {

			}
		}
	}
</script>

<template>
  <group label-width="4.5em" label-margin-right="2em" label-align="right">

    <x-input is-type="china-name" v-model="receiverName" :required="true" label-width="auto" title="姓名"></x-input>

    <x-input is-type="china-mobile" v-model="phoneNumber" :required="true" label-width="auto" title="手机"></x-input>

    <x-address title="位置" @on-hide="onChoosePanelHide" v-model="addressAreas" :list="addressData" placeholder="请选择地址" :popup-style="{zIndex: 5001}">
      <template slot="title" slot-scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;width: auto;">
          <i class="fa fa-map-marker" style="font-size:20px;vertical-align:middle; color: #1AAD19;" aria-hidden="true"></i>
        <span style="vertical-align:middle;">地址</span>
      </span>
      </template>
    </x-address>

    <x-textarea :required="true" :max="30" v-model="detailInfo" placeholder="详细位置"></x-textarea>

    <box gap="10px 10px">
      <x-button @click.native="onSubmit" type="primary" :disabled="saveBtnDisable">确认</x-button>
    </box>

  </group>
</template>
<style lang="scss">

</style>
<script>
import isEmpty from 'is-empty'
import { Box, Flexbox, FlexboxItem, Group, Grid, GridItem, Cell, XInput, XTextarea, XButton, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
export default {
  components: { Box, Flexbox, FlexboxItem, Group, Grid, GridItem, XInput, XTextarea, XButton, XAddress, ChinaAddressV4Data },
  data() {

    return {

      saveBtnDisable: true,

      addressId: null,
      phoneNumber: '',
      receiverName: '',
      addressAreas: ['北京市', '市辖区', '东城区'],

      country: '',
      province: '',
      city: '',
      postalCode: '',
      detailInfo: '',


      addressData: ChinaAddressV4Data,
      addressValue: ['北京市', '市辖区', '东城区']
    }
  },
  watch: {
    // 以下数据变化，均验证表单
    phoneNumber: function () { this.fromValidate() },
    receiverName: function () { this.fromValidate() },
    detailInfo: function () { this.fromValidate() },
    addressAreas: function () { this.fromValidate() },
  },
  methods: {
    // 表单验证
    fromValidate() {
      this.saveBtnDisable = !(!isEmpty(this.phoneNumber) &&
        !isEmpty(this.receiverName) &&
          !isEmpty(this.country) &&
          !isEmpty(this.province) &&
          !isEmpty(this.city) &&
          !isEmpty(this.postalCode) &&
          !isEmpty(this.detailInfo)
      )
    },
    // 档地址选择面板隐藏，就解析地址数据
    onChoosePanelHide() {
      var areas = value2name(this.addressAreas, ChinaAddressV4Data, ' ').split(' ')
      this.province = areas[0]
      this.city = areas[1]
      this.country = areas[2]
      this.postalCode = this.addressAreas[2]
    },
    setAddressData(address) {
      if (address) {
        this.addressId = address.id
        this.receiverName = address.receiverName
        this.phoneNumber = address.phoneNumber
        this.postalCode = address.postalCode
        this.detailInfo = address.detailInfo
        this.province = address.province
        this.city = address.city
        this.country = address.country
        this.addressAreas = [address.province, address.city, address.country]
      } else {
        this.addressId = null
        this.receiverName = ''
        this.phoneNumber = ''
        this.postalCode = ''
        this.detailInfo = ''
        this.province = ''
        this.city = ''
        this.country = ''
        this.addressAreas = []
      }
    },
    // 确认提交
    onSubmit() {
      var type = 0
      if (!isEmpty(this.addressId) ) {
        type = 1
      }
      this.$emit('submit', {
        address: {
          id: this.addressId,
          phoneNumber: this.phoneNumber,
          receiverName: this.receiverName,
          country: this.country,
          province: this.province,
          city: this.city,
          postalCode: this.postalCode,
          detailInfo: this.detailInfo
        },
        type: type
      })
    }
  }
}
</script>

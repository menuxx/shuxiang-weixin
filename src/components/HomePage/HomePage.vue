<template>
  <div class="sx-container">

    <div class="sx-top-bar">
      <div class="lp">
        <span class="sx-close">x</span>
        <img class="logo-sm" src="../../assets/logo.png">
        <span class="brand-title">雪人读书</span>
      </div>
      <a @click="onSubscribeUs" class="btn-subscribe-us">关注查看抢书状态</a>
    </div>

    <div class="book-list-1" v-for="i in [1,2,3,4]" :key="i">
      <div class="book-item">
        <div class="col1">
          <img class="item-thumb" src="https://pro.modao.cc/uploads3/images/1494/14947625/raw_1512110740.jpeg">
        </div>
        <div class="col2">
          <h4 class="item-name">《见识》 珍藏版</h4>
          <p class="item-desc-text">个人的成就首先取决于“见识”</p>
          <span class="price">￥65.00</span>
        </div>
        <div class="col3">
          <a class="xs-btn-buy">购买</a>
        </div>
      </div>
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

  </div>
</template>
<script>
import { XDialog, Cell, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  data() {
    return {
      showSubscribeUsDialog: false
    }
  },
  methods: {
    onSubscribeUs() {
      this.showSubscribeUsDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/book-list1';
@import "../../styles/xr-top-bar";
@import './HomePage';
@import '../../styles/qrcode-usinfo';
</style>

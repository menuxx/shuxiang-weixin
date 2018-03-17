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
    <div class="book-list-1">
      <div class="book-item" v-for="book in books" :key="book.id">
        <div class="col1">
          <img class="item-thumb" :src="book.coverImageUrl">
        </div>
        <div class="col2">
          <h4 class="item-name">{{ book.name }}</h4>
          <p class="item-desc-text">{{ book.describe }}</p>
          <span class="price">{{ book.price | fenRmb }}</span>
        </div>
        <div class="col3">
          <a class="xs-btn-buy" :href="book.shopUrl">购买</a>
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
import * as api from '../../http/api'
import {mapMutations, mapState} from 'vuex'
import * as types from '../../sotre/types'
export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  beforeRouteEnter(to, from, next) {
    api.getSysBooks().then( res => {
      next(vm => {
        vm.booksLoaded( res.data )
      })
    })
  },
  data() {
    return {
      showSubscribeUsDialog: false
    }
  },
  computed: {
    ...mapState(['books'])
  },
  methods: {
    ...mapMutations({
      booksLoaded: types.BOOKS_LOADED
    }),
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
  .book-list-1 .col2 {
    margin-right: 10px;
    flex: 1;
  }
  .book-list-1 .col3 {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .xs-btn-buy {
      width: 1.6rem;
      align-self: center;
    }
  }
</style>

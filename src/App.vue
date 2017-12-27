<template>
  <div id="app-body">
    <router-view />
    <loading v-model="showAppLoading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { Loading } from 'vux'
  export default {
    components: { Loading },
    computed: {
      ...mapState({
        showAppLoading: state => state.app.showLoading
      })
    },
    name: 'app'
  }
</script>
<style lang="scss">
@import "./styles/rem";
html, body {
  margin: 0; padding: 0;
}
#app-body {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style lang="less">
@import '~vux/src/styles/reset.less';
@weuiCellLabelWidth: 10px;
</style>

<template>
  <div class="xs-container">
    <div class="tips">
      <a></a>
      已领取 20 本，共100本
      <a class="close-btn">
        <i class="fa fa-times-circle-o" aria-hidden="true"></i>
      </a>
    </div>
    <div class="sx-partner-list">
      <div class="sx-partner-item" v-for="i in list">
        <div class="p1">
          <span class="item-number">{{ i }}</span>
          <img class="user-avatar-sm" src="https://pro.modao.cc/uploads/images/447711/raw_1435125489.jpeg">
          <span class="user-name">雷锋</span>
        </div>
        <div class="pr">
          <span class="time">2017-11-30 18:32</span>
        </div>
      </div>
      <div v-if="list.length === 0" class="empty-list">
        <i class="fa fa-sticky-note-o" aria-hidden="true"></i> 早起的鸟有虫吃，还不快去抢
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: []
      }
    }
  }
</script>
<style lang="scss" scoped>
.xs-container {
  background-color: #fff;
}
.tips {
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
.sx-partner-list {

}
.sx-partner-item {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0.5rem;
  .p1 {
    font-size: 0.8rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    .item-number {
      font-size: 1rem;
      margin-right: 0.3rem;
    }
    .user-avatar-sm {
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      margin-right: 0.3rem;
    }
    .user-name {
      font-size: 0.8rem;
    }
  }
  .pr {
    .time {
      font-size: 0.6rem;
      color: #b5b1b5;
    }
  }
}

.empty-list {
  font-size: 0.6rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 1rem;
  .fa {
    margin-bottom: 10px;
    font-size: 1.5rem;
  }
}

</style>
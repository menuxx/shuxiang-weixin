<template>
  <div class="sx-container">
    <div class="sx-partner-list">
      <div class="sx-partner-item" v-for="p in partners">
        <div class="p1">
          <span class="item-number">{{ p.queueNum }}</span>
          <img class="user-avatar-sm" :src="p.user.avatarUrl">
          <span class="user-name">{{ p.user.userName }}</span>
        </div>
        <div class="pr">
          <span class="time">{{ p.updateAt | timestampFormat }}</span>
        </div>
      </div>
      <div v-if="partners.length === 0" class="empty-list">
        <i class="fa fa-sticky-note-o" aria-hidden="true"></i> 早起的鸟有虫吃，还不快去抢
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['data'],
    data() {
      return {
        partners: this.data.partners,
        partnerCount: this.data.partnerCount
      }
    }
  }
</script>
<style lang="scss" scoped>
.sx-container {
  background-color: #fff;
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

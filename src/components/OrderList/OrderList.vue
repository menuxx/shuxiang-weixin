<template>
    <div class="sx-container">
        <div class="order-list-1">
            <div class="order-item" v-for="order in orders" :key="order.id">
              <div class="item-list">
                <div class="order-item" v-for="item in order.items" :key="item.id">
                  <div class="col1">
                    <img class="item-thumb" :src="item.itemThumbImageUrl">
                  </div>
                  <div class="col2">
                    <h4 class="item-name">{{ item.itemName }}</h4>
                    <p class="item-desc-text">{{ order.createAt }} 领取</p>
                  </div>
                  <div class="col3" @click="showDetailInfo(order)">
                    <a class="xs-btn-status"
                       :class="{ 'xs-btn-status-no-send': order.status === 2, 'xs-btn-status-send': order.status === 3 }">未发货</a>
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div v-if="orders.length < 1" class="empty-list">
            <i class="fa fa-sticky-note-o" aria-hidden="true"></i> 还什么都没有
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showItemExpressDialog" :hide-on-blur="false">
                <group>
                    <cell title="快递信息"></cell>
                    <cell-form-preview :list="detailList"></cell-form-preview>
                    <x-button type="primary" disabled>查看详细</x-button>
                </group>
            </x-dialog>
        </div>
    </div>
</template>
<script>
  import * as api from '../../http/api'
  import * as types from '../../sotre/types'
  import * as date from '../../lib/date'
  import isEmpty from 'is-empty'
	import {mapActions, mapMutations, mapState} from 'vuex'
	import {XButton, Group, Cell, CellFormPreview, XDialog, TransferDomDirective as TransferDom} from 'vux'
	export default {
		directives: {TransferDom},
		components: {XButton, Group, Cell, CellFormPreview, XDialog},
		data() {
			return {
				showItemExpressDialog: false,
        detailList: []
			}
		},
		// 数据加载
		beforeRouteEnter(to, from, next) {
			var {pageNum=1} = to.query
      // 获取所有订单 （出包括付款成功后所有状态的）
      api.loadMyOrders(pageNum).then( res => {
        next(vm => {
          vm.myOrdersLoaded(res.data)
        })
      })
		},
    computed: {
      ...mapState({
        orders : state => state.orders
      }),
    },
		methods: {
			...mapMutations({
        myOrdersLoaded: types.MY_ORDERS_LOADED
      }),
      showDetailInfo(order) {
			  if ( order.status <= 2 ) {
			    this.$vux.toast.show({
            text: '还没有发货',
            type: 'text'
          })
        } else if (order.status >= 3) {
          this.detailInfo = [
            {
             label: '物流',
             value: order.expressName
            }, {
             label: '发货日期',
             value: date.formatDateTime(new Date(order.expressTime))
            }, {
             label: '运单号',
             value: order.expressNo
            }
          ]
          this.showItemExpressDialog = true
        }
      }
		}
	}
</script>
<style lang="scss">
    .order-item {
        padding: 0.3rem 0.5rem;
        font-size: 0.8rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        .col1 {
            flex: 0.8;
            .item-thumb {
                width: 100px;
                height: 100px;
            }
        }
        .col2 {
            flex: 1.5;
            text-align: left;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            padding: 0.5rem 0;
            .item-name {
                font-weight: normal;
                margin: 0;
            }
            .item-desc-text {
                margin: 0;
                color: #aaaaaa;
                font-size: 0.7rem;
            }
            .price {
                font-size: 0.7rem;
            }
        }
        .col3 {
            flex: 1;
            display: flex;
            flex-flow: row nowrap;
            padding: 0.5rem 0;
            .xs-btn-status {
                align-self: flex-end;
                color: #fff;
                padding: 0.3rem;
                font-size: 0.7rem;
            }
            .fa {
                margin-left: 1rem;
                align-self: center;
                font-size: 1.2rem;
            }
        }
    }

    // 未发货
    .xs-btn-status-no-send {
        background-color: #e51c23;
    }

    // 已发货
    .xs-btn-status-send {
        background-color: #259b24;
    }

    // 空列表占位
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

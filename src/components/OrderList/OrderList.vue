<template>
    <div class="sx-container">

        <div class="order-list-1">
            <div class="order-item" v-for="order in orders" :key="i">
                <div class="col1">
                    <img class="item-thumb" :src="order.item.thumbImg">
                </div>
                <div class="col2">
                    <h4 class="item-name">{{ order.itemName }}</h4>
                    <p class="item-desc-text">2017-11-30 19:32 领取</p>
                </div>
                <div class="col3">
                    <a class="xs-btn-status"
                       :class="{ 'xs-btn-status-no-send': i % 2 === 0, 'xs-btn-status-send': i % 2 === 1 }">未发货</a>
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        <div v-if="true" class="empty-list">
            <i class="fa fa-sticky-note-o" aria-hidden="true"></i> 还什么都没有
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showItemExpress" hide-on-blur="false">
                <group>
                    <cell title="快递信息"></cell>
                    <cell-form-preview :list="list"></cell-form-preview>
                    <x-button type="primary" disabled>查看详细</x-button>
                </group>
            </x-dialog>
        </div>
    </div>
</template>
<script>
    import isEmpty from 'is-empty'
	import {mapActions} from 'vuex'
	import {XButton, Group, Cell, CellFormPreview, XDialog, TransferDomDirective as TransferDom} from 'vux'
	export default {
		directives: {TransferDom},
		components: {XButton, Group, Cell, CellFormPreview, XDialog},
		data() {
			return {
				showItemExpress: true,
				list: [{
					label: '物流',
					value: '顺丰快递'
				}, {
					label: '发货日期',
					value: '2017-12-12 14:20:21'
				}, {
					label: '运单号',
					value: 'j3812989239012097425'
				}]
			}
		},
		// 数据加载
		beforeRouteUpdate(to, from, next) {
			var {status=1, pageNum=1, pageSize=1} = to.params
			this.$store.dispatch('loadMyOrders', to.params).then( orders =>{
				next()
            })
		},
		methods: {
			...mapActions(['loadMyOrders']),
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
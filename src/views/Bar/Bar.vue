<template>
    <div id="Bar">
        <div class="bar_header">
            <div class="contanier flex_wrap">
                <div class="shop_sell">
                    <button class="shop_btn btn" v-on:click="handleGoShop"></button>
                </div>
                <div class="cion_dia">
                    <div class="cf_wrap pos_rea">
                        <i class="cion_icon icon pos_abs"></i>
                        <span class="txt">
                            {{coinText}}
                        </span>
                    </div>
                    <div class="cf_wrap pos_rea">
                        <i class="dia_icon icon pos_abs"></i>
                        <span class="txt">
                            {{diaText}}
                        </span>
                    </div>
                </div>
                <VigorSp></VigorSp>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="bar_body">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="物品" name="item">
                    <ItemTab ref="item" v-bind:item-data="itemData" @event-item='receiveChildData' @on-sell="handleSell"></ItemTab>
                </el-tab-pane>
                <el-tab-pane label="战士" name="char" >
                    <WarriorTab ref="warrior" :warriorData="warriorData" @on-sell="handleSell"></WarriorTab>
                </el-tab-pane>
                <el-tab-pane label="装备" name="equip">
                    <EquipTab ref="equip" :equipData="equipData" @on-sell="handleSell"></EquipTab>
                </el-tab-pane>
                <el-tab-pane label="碎片" name="fourth">
                    <FragmentTab></FragmentTab>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="item_receive pos_abs" v-if="itemVisible">
            <div class="mask pos_abs"></div>
            <div class="item_wrap pos_abs">
            <ul class="item_list">
                <li class="item_item" v-for="(item, index) in items" :key="index">
                    <div class="item_box">
                        <div class="item_pic">
                            <img v-bind:src="item.headImg || item.img"/>
                        </div>
                        <p class="item_num">X1</p>
                    </div>
                    <div class="item_name">{{item.title}}</div>
                </li>
            </ul>
            <button v-on:click="handleOk">OK</button>
            </div>
        </div>
        <div class="bar_footer">
            <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import VigorSp from '../../components/VigorSp';
import PageBottom from '../../components/PageBottom';
import ItemTab from '../../components/ItemTab';
import WarriorTab from '../../components/WarriorTab';
import EquipTab from '../../components/EquipTab';
import FragmentTab from '../../components/FragmentTab';
import {mapGetters, mapMutations} from 'vuex';

import { differenceBy } from 'lodash'

export default {
    name:"Bar",
    components:{
        VigorSp,
        PageBottom,
        ItemTab,
        WarriorTab,
        EquipTab,
        FragmentTab
    },
    data() {
        return {
            loadingVisible:false,
            activeName:"item",
            itemData:[],
            warriorData:[],
            equipData:[],
            fragmentData:[],
            items:[],
            itemVisible:false
        }
    },
    computed:{
        ...mapGetters('gamerData',[
            'coinText',
            'diaText'
        ])
    },
    created() {
        let that = this;
        this.loadingVisible = true;
        this.axios({
            method:'post',
            url:'/index.php/index/ball/getItem'
        }).then(function(res){
            that.loadingVisible = false;
            if(res.status != 200){
                that.$message({
                    message:"加载超时"
                })
                return;
            }
            that.itemData = res.data;
        })
    },
    methods: {
        ...mapMutations('gamerData',[
            'increCoinCount'
        ]),
        handleGoShop(){
            this.$router.push({path:'/shop'})
        },
        handleClick(tabs) {
            if(tabs.index == "3"){
                return;
            }
            let url = "";
            let that = this;
            this.loadingVisible = true;
            switch(tabs.index){
                case "0":
                    url = '/index/ball/getItem';
                    break;
                case "1":
                    url = '/index/ball/getWarrior';
                    break;
                case "2":
                    url = '/index/ball/getEquip';
                    break;
            }
            this.axios({
                method:'post',
                url:url
            }).then(function(res){
                that.loadingVisible = false;
                switch(res.config.url){
                    case "/index.php/index/ball/getItem":
                        that.itemData = res.data;
                        break;
                    case '/index/ball/getWarrior':
                        that.warriorData = res.data;
                        break;
                    case '/index/ball/getEquip':
                        that.equipData = res.data;
                        break;
                    case '/index/ball/getFragment':
                        that.fragmentData = res.data;
                        break;
                }
            })
        },
        receiveChildData(val){
            this.items = val;
            this.itemVisible = true;
        },
        handleOk(){
            if(this.items.length <= 1){
                this.itemVisible = false;
                return;
            }
            this.items.shift();
        },
        handleSell(){
            //出售人物之后删除列表
            this.loadingVisible = true;
            let id = [];
            let num = 0;

            switch (this.activeName) {
                case 'char':
                    id = this.$refs.warrior.selectedId;
                    break;
                case 'item':
                    id = [this.$refs.item.wpObj['id']];
                    num = this.$refs.item.wp_num;
                    break;
                case 'equip':
                    id = this.$refs.equip.selectedId;
                    break;
            }

            this.axios({
                method: 'post',
                url: '/index.php/index/ball/sellGoods',
                data:{
                    id,
                    type: this.activeName,
                    num
                }
            }).then(() => {

                let count = this.changeUIBySellGoods(id, num)[this.activeName]()      

                // 更新金币
                this.increCoinCount(count * 400);

                this.loadingVisible = false;
                
            }).catch(err => {
                console.log(err)
            })
        },

        // 根据当前出售的物品改变视图
        changeUIBySellGoods(id, num) {
            let that = this;
            return {
                'equip'() {
                    return setCharEquip('equipData')
                },
                'char'() {
                    return setCharEquip('warriorData')
                },
                'item'() {
                    that.itemData[id] = that.itemData[id] - num
                    return num
                }
            }
            function setCharEquip (data) {
            
                const arrID = id.map(item => { return { id: item } });

                const diff = differenceBy(that[data], arrID, 'id');

                that[data] = diff;

                console.log('data', data)

                return id.length;
            }
        }
    }
}
</script>

<style lang="less">
@import './css/Bar.less';
</style>
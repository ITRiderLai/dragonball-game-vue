<template>
    <div id="Shop">
        <div class="shop_header">
            <div class="cf_wrap flex_wrap">
                <button class="bar_btn" v-on:click='handleGoBag'></button>
                <div class="coin_dia_wrap pos_rea flex_one">
                    <i class="icon coin pos_abs"></i>
                    <span class="txt">{{coinText}}</span>
                </div>
                <div class="coin_dia_wrap pos_rea flex_two">
                    <i class="icon dia pos_abs"></i>
                    <span class="txt">{{diaText}}</span>
                </div>
            </div>
        </div>
        <div class="shop_body">
            <ul class="goods_list">
                <li class="goods_item flex_wrap" v-for="(item) in shopData" :key="item.id">
                    <div class="goods_pic pos_rea">
                        <img v-bind:src="item.img"/>
                        <div class="goods_num font_seven_white text_center">{{item.num}}</div>
                    </div>
                    <div class="goods_desc flex_one">
                        <h6>{{item.china_name + '*' + item.num}}</h6>
                        <p>{{item.desc}}</p>
                    </div>
                    <div class="buy_btn font_seven_white pos_rea" v-on:click="buyGoods(item.name,item.num,item.china_name)">
                         <i v-bind:class="['cf_icon','pos_abs',item.buy_post == 0 ? 'coin' : 'dia']"></i>
                        <span>{{item.price}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="shop_footer">
            <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import {mapGetters} from 'vuex';
export default {
    name:'Shop',
    components:{
        PageBottom
    },
    data() {
        return {
            shopData:[],
            loadingVisible:false
        }
    },
    computed:{
        ...mapGetters('gamerData',[
            'coinText',
            'diaText'
        ])
    },
    created() {
        this.loadingVisible = true;
        this.axios({
            method:'post',
            url:'/index.php/index/ball/shop'
        }).then(res=>{
            this.loadingVisible = false;
            this.shopData = res.data
        });
    },
    methods:{
        handleGoBag(){
            this.$router.push({path:'/bar'});
        },
        buyGoods(name,num,china_name){
            this.axios({
                method:'post',
                url:'/index.php/index/ball/buy',
                data:{
                    name:name,
                    num:num
                }
            }).then(()=>{
                this.$message({
                    message:"购买了"+ china_name + "*" + num,
                    type:'success'
                })
            })
        }
    }
}
</script>

<style lang="less">
@import './css/Shop.less';
</style>
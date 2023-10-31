<template>
    <div id="House">
        <div class="house_header">
            <div class="house_title flex_wrap">
                <div class="title "></div>
                <div class="cf_wrap flex_one">
                    <div class="coin_dia_wrap  pos_rea">
                        <i class="icon coin pos_abs"></i>
                        <span class="txt">{{coinText}}</span>
                    </div>
                    <div class="coin_dia_wrap pos_rea">
                        <i class="icon dia pos_abs"></i>
                        <span class="txt">{{diaText}}</span>
                    </div>
                </div>
                <div class="close_btn">
                    <button class="btn" v-on:click="goBack"></button>
                </div>
            </div>
        </div>
        <div class="house_body">
            <div class="char_wrap">
                <ul class="char_list">
                    <li class="char_item pos_rea" v-for="(item,index) in char_data" :key="index">
                        <img class="char_head" v-bind:src="item.headImg"/>
                    </li>
                </ul>
            </div>
            <div class="char_extra pos_rea">
                <ul class="extra_list">
                    <li class="extra_item float_left pos_rea" v-for="(item,index) in extra_npc" :key="index" v-bind:style="{background:'url('+ item.url +') no-repeat',backgroundSize:'cover'}">
                        <p v-on:click="getChar(item.id,item.price)">{{item.price}}</p>
                    </li>
                </ul>
                <div class="gold_icon"></div>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="house_footer">
            <PageBottom></PageBottom>
        </div>
        <el-dialog
        custom-class="success-dialog"
        :visible.sync="dialogVisible"
        width="100%"
        :show-close ="false"
        :close-on-click-modal = "false"
        :close-on-press-escape = "false"
        center>
            <div class="char_data pos_rea">
                <div class="grade_start pos_abs">
                    <span class="grade">Lv.{{char_item.grade}}</span>
                    <div class="start_wrap">
                        <i class="start" v-for="(item, index) in char_item.star" :key="index"></i>
                    </div>
                </div>
                <div class="char">
                    <img v-bind:src="char_item.charImg"/>
                </div>
                <p class="char_name">{{char_item.title}}</p>
                <div class="zl_fy">
                    <div class="zl_wrap pos_rea">
                        <i class="zl_icon icon pos_abs"></i>
                        <p class="txt">{{char_item.current_zl}}</p>
                    </div>
                </div>
            </div>
            <button class="cousel" v-on:click="handleCousel">OK</button>
        </el-dialog>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import {mapGetters,mapMutations} from 'vuex';
import charData from '../../charData.json';
export default {
    name:"House",
    components:{
        PageBottom
    },
    data() {
        return {
            dialogVisible:false,
            loadingVisible:false,
            char_data:[],
            char_item:{},
            extra_npc:[
                {id:"1",name:"popo",url:"/image/one_two_start.png",price:1000},
                {id:"2",name:"xianren",url:"/image/one_three_start.png",price:5000},
                {id:"3",name:"jiewang",url:"/image/three_five_start.png",price:80000},
                {id:"4",name:"guixianren",url:"/image/two_four_start.png",price:30000}
            ]
        }
    },
    computed:{
        ...mapGetters('gamerData',[
            'coinText',
            'diaText'
        ])
    },
    methods: {
        ...mapMutations('gamerData',[
            'increCoinCount'
        ]),
        getChar(index,price){
            this.loadingVisible = true;
            this.axios({
                method:"post",
                url:"/index.php/index/ball/getChar",
                data:{
                    star:index
                }
            }).then(res=>{
                this.loadingVisible = false;
                if(res.data.state != 200){
                    return;
                }
                let char = charData.filter(item=>{
                    return item.name == res.data.char.char_name;
                })[0]
                let obj = Object.assign(res.data.char,char);
                this.char_item = obj;
                this.char_data.unshift(obj);
                this.dialogVisible = true;
                console.log(res.data.coin);
                this.increCoinCount(-price);
            })
        },
        handleCousel(){
            this.dialogVisible = false;
        },
        goBack(){
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="less">
@import './css/house.less';
</style>
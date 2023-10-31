<template>
    <div id="itemTab">
        <ul class="wp_list">
            <li class="wp_item pos_rea" v-for="(item,index) in itemValue" :key="item.id" v-on:click="WpColorChange(item,index)">
                <div v-bind:class="[{'img_active':index === wpIndex},'img_wrap']">
                    <img class="wp_img" v-bind:src="item.path">
                </div>    
                <div class="wp_name">
                    <p>
                        <span>{{item.name}}</span>
                    </p>
                </div>
                <div class="wp_num">
                    {{item.num}}
                </div>
            </li>
        </ul>
        <div v-bind:class="[{'use_active':isoPacity},'use_wrap']">
            <div class="content_box flex_wrap">
                <div class="wp_desc">
                    <h5 class="wp_name">{{wpObj.name}}</h5>
                    <p class="wp_desc">{{wpObj.desc}}</p>
                </div>
                <div class="add_wrap">
                    <button class="reduce btn" v-bind:disabled="isDisabled === true ? 'disabled':null" v-on:click="handleReduce"></button>
                    <input class="num_input" type="text" v-bind:value="wp_num"  v-bind:disabled="isDisabled === false ? 'disabled':null"/>
                    <button class="add btn" v-bind:disabled="isDisabled === true ? 'disabled':null" v-on:click="handleAdd"></button>
                </div>
                <div class="sell_wrap">
                    <button class="btn use_btn" v-bind:disabled="isDisabled === true ? 'disabled':null" v-on:click="handleUse">Use</button>
                    <button class="btn sell_btn" v-bind:disabled="isDisabled === true ? 'disabled':null" v-on:click="handleSell">sell</button>
                </div>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
    </div>
</template>

<script>
import {mapMutations} from 'vuex';
import charData from '../charData.json';
let jsonData = [
    {id:'xd',name:"仙豆",category:"sp值",desc:"增加1点SP值",path:"/image/item/xd_icon.png",useScen:"now"},
    {id:'css',name:"超圣水",category:"潜力",desc:"用于战力的潜力激发",path:"/image/item/css_icon.png",useScen:"other"},
    {id:'tys',name:"铜钥匙",category:"铜宝箱",desc:"开启铜宝箱的钥匙",path:"/image/item/tys_icon.png",useScen:"other"},
    {id:'mini_coin',name:"一小袋金币",category:"金币",desc:"增加30000金币",path:"/image/item/mini_coin_icon.png",useScen:"now"},
    {id:'mini_dia',name:"小钻石卡",category:"钻石",desc:"增加10钻石",path:"/image/item/mini_dia_icon.png",useScen:"now"},
    {id:'fivewzjn',name:"五星武者胶囊",category:"胶囊",desc:"3-5星战士",path:"/image/item/fivewuzhejiaonang.png",useScen:"jiaonang"},
    {id:'fivewqjn',name:"五星武器胶囊",category:"胶囊",desc:"3-5星武器",path:"/image/item/fivewuqijiaonang.png",useScen:"jiaonang"},
    {id:'jys',name:"金钥匙",category:"金宝箱",desc:"开启金宝箱的钥匙",path:"/image/item/jys_icon.png",useScen:"other"},
    {id:'yys',name:"银钥匙",category:"银宝箱",desc:"开启银宝箱的钥匙",path:"/image/item/yys_icon.png",useScen:"other"}
]
export default {
    name:"ItemTab",
    props:[
        'itemData'
    ],
    data() {
        return {
            wpIndex:null,
            wpObj:{
                name:"",
                desc:"",
                category:"",
                useScen:"",
                currentNum:0
            },
            wp_num:1,
            isoPacity:false,
            isDisabled:true,
            loadingVisible:false,
            item_Data:[],
            itemVisible:false,
            item:{}
        }
    },
    computed:{
        spCount(){
            return this.$store.state.gamerData.spCount;
        },
        itemValue(){
            let itemArr = [];
            let arr = [];
            // // 已拥有的物品放入一个数组
            for(let key in  this.itemData){
                if(this.itemData[key] != 0){
                    let obj = new Object();
                    obj.name = key;
                    obj.num = this.itemData[key];
                    itemArr.push(obj);
                }
            }
            itemArr.forEach(item=>{
                jsonData.forEach(param=>{
                    if(item.name == param.id){
                        param.num = item.num;
                        arr.push(param);
                    }
                })
            });
            return arr;
        }
    },
    methods: {
        ...mapMutations('gamerData',[
            'increSpCount',
            'increVigorCount',
            'increCoinCount',
            'increDiaCount'
        ]),
        //选择物品同时把数据传入Data
        WpColorChange(item,index){
            this.wpIndex = index;
            this.wpObj.name = item.name;
            this.wpObj.id = item.id;
            this.wpObj.desc = item.desc;
            this.wpObj.currentNum = item.num;
            this.wpObj.useScen = item.useScen;
            this.wpObj.category = item.category;
            this.wp_num = 1
            if(this.isoPacity === false){
                this.isoPacity = true;
            }
            if(this.isDisabled === true){
                this.isDisabled = false;
            }
        },
        //数量添加
        handleAdd(){
            if(this.wp_num === this.wpObj.currentNum){
                return false;
            }
            this.wp_num += 1;
        },
        //数量减少
        handleReduce(){
            if(this.wp_num === 1){
                return false;
            }
            this.wp_num -= 1;
        },
        //物品使用
        handleUse(){
            let useValue = "";
            let that = this;
            //物品分为即刻使用和跳转到应用场景使用
            if(this.wpObj.useScen === "other"){ 
                if(this.wpObj.id == 'tys' || this.wpObj.id == 'yys' || this.wpObj.id == 'jys'){
                    this.$router.push({path:'/event'});
                }
                return
            }
            this.loadingVisible = true;
            if(this.wpObj.useScen === 'jiaonang'){
                this.axios({
                    method:'post',
                    url:'/index.php/index/ball/openJn',
                    data:{
                        item:this.wpObj.id,
                        useNum:this.wp_num
                    }
                }).then(res=>{
                    this.itemVisible = true;
                    let data = [];
                    if(res.data.category == 0){
                        res.data.result.forEach(item=>{
                            let val = charData.find(param=>item.char_name == param.name);
                            data.push(val);
                        })
                    }else{
                        data = res.data.result;
                    }
                    let nowNum =  this.itemValue[this.wpIndex];
                    let newNum =  this.itemValue[this.wpIndex].num -= this.wp_num;
                    let itemObj = Object.assign({},nowNum,{num:newNum});
                    Object.assign({},this.itemValue,itemObj);
                    this.$forceUpdate();
                    this.loadingVisible = false;

                    this.wpObj.currentNum = this.itemValue[this.wpIndex].num;
                    this.wp_num = 1;
                    //当物品数量等于0.清空该物品列表数据,返回未选择状态
                    if(this.wpObj.currentNum === 0){
                        this.itemValue.splice(this.wpIndex,1);
                        this.wpObj.name = "";
                        this.wpObj.desc = "";
                        this.isoPacity = false;
                        this.isDisabled = true;
                        this.wpIndex = null;
                    } 
                    this.$emit('event-item',data);
                })
                return;
            }
            //判断使用的是什么物品并且该物品是否达到了使用上限
            switch(this.wpObj.id){
                case 'xd':
                    if(this.spCount >= 10){
                        this.$message({
                            message:"体力已经满咯",
                            type:"success"
                        })
                        return false;
                    }
                    break;
            }

             //物品使用增加值
            switch(this.wpObj.id){
                case 'xd':
                    useValue = this.wp_num
                    break
                case 'rz':
                    useValue = this.wp_num * 120
                    break
                case 'mini_coin':
                    useValue = this.wp_num * 30000
                    break
                case 'max_coin':
                    useValue = this.wp_num * 300000
                    break
                case 'mini_dia':
                    useValue = this.wp_num * 10
                    break
                case 'max_dia':
                    useValue = this.wp_num * 100
                    break
            }

            this.axios({
                method:'post',
                url:'/index.php/index/ball/useItem',
                data:{
                    item:this.wpObj.id,
                    useNum:this.wp_num,
                    useValue:useValue
                }
            }).then(function(res){
                that.loadingVisible = false;
                if(res.status != 200){
                    that.$message({
                        message: res.statusText,
                        type:"success"
                    });
                    return 
                }
                // 使用完毕弹窗
                that.$message({
                    message: that.wpObj.category+ "+" + useValue,
                    type:"success"
                });
                //物品使用结果
                switch(that.wpObj.id){
                    case 'xd':
                        that.increSpCount(useValue);
                        break
                    case 'rz':
                        that.increVigorCount(useValue);
                        break
                    case 'mini_coin':
                        that.increCoinCount(useValue);
                        break
                    case 'max_coin':
                        that.increCoinCount(useValue);
                        break
                    case 'mini_dia':
                        that.increDiaCount(useValue);
                        break
                    case 'max_dia':
                        that.increDiaCount(useValue);
                        break
                }
                //物品使用后总数量减去用去的数量，选择数量初始化为1
                that.itemValue[that.wpIndex].num -= that.wp_num;
                that.wpObj.currentNum = that.itemValue[that.wpIndex].num;
                that.wp_num = 1;

                //当物品数量等于0.清空该物品列表数据,返回未选择状态
                if(that.wpObj.currentNum === 0){
                    that.itemValue.splice(that.wpIndex,1);
                    that.wpObj.name = "";
                    that.wpObj.desc = "";
                    that.isoPacity = false;
                    that.isDisabled = true;
                    that.wpIndex = NaN;
                }        
            })     
        },
        //物品系统出售
        handleSell(){

            this.$emit('on-sell');

            this.wp_num = 1;

            this.handleReset()
        },

        handleReset() {
            
            this.wp_num = 1;
            this.wpIndex = null;
            this.wpObj = {
                name:"",
                desc:"",
                category:"",
                useScen:"",
                currentNum:0
            }
            this.isoPacity = false;
            this.isDisabled = true;
        }
        
    },
}
</script>

<style lang="less">
@import '../css/ItemTab.less';
</style>
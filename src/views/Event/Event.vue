<template>
    <div id="Event">
         <div class="event_body">
            <ul class="event_list">
                <li class="event_item" v-for="(item, index) in ysData" :key="index">
                    <button v-on:click="handleOpen(item.name,index)" v-bind:disabled="item.num == 0 ? 'disabled' : null">Open</button>
                    <span>{{item.num}}</span>   
                </li>
            </ul>
         </div>
        <el-dialog
        custom-class="event-dialog"
        :visible.sync="dialogVisible"
        width="11rem"
        top="8rem"
        :show-close ="false"
        :close-on-press-escape = "false"
        center>
            <ul class="prize_list">
                <li class="prize_item" v-for="(item, index) in prizeData" :key="index">
                    <span>{{item.title}}</span>
                </li>
            </ul>
            <button class="once_more" v-on:click="handleOnceOpen"  v-bind:disabled="onceMoreDisabled == true ? 'disabled' : null"></button>
        </el-dialog>
        <div class="item_receive pos_abs" v-if="itemVisible">
            <div class="mask pos_abs"></div>
            <div class="item_wrap pos_abs">
                <div class="item_box">
                    <div class="item_pic">
                        <img v-bind:src="item.url"/>
                    </div>
                    <p class="item_num">X1</p>
                </div>
                <div class="item_name">{{item.title}}</div>
                <button v-on:click="itemVisible = false">OK</button>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
         <div class="event_footer">
            <PageBottom></PageBottom>
         </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
let prize_Data = {
    treasureChest:[
        {name:"xd",title:"仙豆",url:"/image/item/xd_icon.png"},
        {name:"fivewzjn",title:"五星武者胶囊",url:"/image/item/fivewuzhejiaonang.png"},
        {name:"mini_dia",title:"小钻石卡",url:"/image/item/mini_dia_icon.png"},
        {name:"fivewqjn",title:"五星武器胶囊",url:"/image/item/fivewqjiaonang.png"},
        {name:"mini_coin",title:"小袋金币",url:"/image/item/mini_coin.png"}
    ],
    silverChest:[
        {name:"xd",title:"仙豆",url:"/image/item/xd_icon.png"},
        {name:"wl",title:"乌龙",url:"/image/item/wl_icon.png"},
        {name:"mini_dia",title:"小钻石卡",url:"/image/item/mini_dia_icon.png"},
        {name:"jys",title:"金钥匙",url:"/image/item/jys_icon.png"},
        {name:"mini_coin",title:"小袋金币",url:"/image/item/mini_coin_icon.png"}
    ],
    copperChest:[
        {name:"xd",title:"仙豆",url:"/image/item/xd_icon.png"},
        {name:"wl",title:"乌龙",url:"/image/item/wl_icon.png"},
        {name:"yys",title:"银钥匙",url:"/image/item/yys_icon.png"},
        {name:"jys",title:"金钥匙",url:"/image/item/jys_icon.png"},
        {name:"mini_coin",title:"小袋金币",url:"/image/item/mini_coin.png"}
    ],
}
export default {
    name:"Event",
    components:{
        PageBottom,
    },
    data() {
        return {
            dialogVisible:false,
           ysData:[],
           prizeData:prize_Data.silverChest,
           itemVisible:false,
           item:{},
           current_ys:"",
           currentYs_index:0,
           loadingVisible:false,
           onceMoreDisabled:true
        }
    },
    created() {
        this.loadingVisible = true;
        this.axios({
            method:'post',
            url:'/index.php/index/ball/event'
        }).then(res=>{
            this.loadingVisible = false;
            let ys = res.data.ys
            for(let i in ys){
                let obj = {name:i,num:ys[i]};
                this.ysData.push(obj);
            }
        })
        
    },
    methods: {
        handleOpen(val,index){
            this.current_ys = val;
            this.currentYs_index = index;
            this.loadingVisible = true;
            this.axios({
                method:'post',
                url:'/index.php/index/ball/openChest',
                data:{
                    ys:val
                }
            }).then(res=>{
                let that = this;
                this.dialogVisible = true;
                let timer;
                this.ysData[index].num -= 1; 
                this.loadingVisible = false;
                const promiseTimer = new Promise((resolve)=>{
                    timer = setInterval(()=>{
                        that.prizeData.unshift(that.prizeData[that.prizeData.length-1]);
                        that.prizeData.pop();
                    },100)
                    setTimeout(()=>{
                        resolve();
                    },5000)
                });
                promiseTimer.then(()=>{
                    let prizeIdx = that.prizeData.findIndex(item=>item.name == res.data.prize);
                    that.item = that.prizeData[prizeIdx];
                    clearInterval(timer);
                    const temp = that.prizeData[0];
                    that.prizeData[0] = that.prizeData[prizeIdx];
                    that.prizeData[prizeIdx] = temp;
                    that.itemVisible = true;
                    that.onceMoreDisabled = false;
                });
                
            })
        },
        handleOnceOpen(){
            if(this.ysData[this.currentYs_index].num <= 0){
                this.$message({
                    message:"钥匙数量不足哦！",
                    type:"success"
                })
                return;
            } 
            switch(this.current_ys){
                case 'jys':
                    this.prizeData = prize_Data.treasureChest;
                    break;
                case 'yys':
                    this.prizeData = prize_Data.silverChest;
                    break;
                case 'tys':
                    this.prizeData = prize_Data.copperChest;
                    break;
            }
            this.loadingVisible = true;
            this.axios({
                method:'post',
                url:'/index.php/index/ball/openChest',
                data:{
                    ys:this.current_ys
                }
            }).then(res=>{
                let that = this;
                this.dialogVisible = true;
                let timer;
                this.ysData[this.currentYs_index].num -= 1; 
                this.loadingVisible = false;
                const promiseTimer = new Promise((resolve)=>{
                    timer = setInterval(()=>{
                        that.prizeData.unshift(that.prizeData[that.prizeData.length-1]);
                        that.prizeData.pop();
                    },100)
                    setTimeout(()=>{
                        resolve();
                    },5000)
                });
                promiseTimer.then(()=>{
                    clearInterval(timer);
                    let prize = that.prizeData.find(item=>item.name == res.data.prize);
                    that.item = prize;
                    that.prizeData = [prize];
                    let itemTimer = setTimeout(()=>{
                         that.itemVisible = true;
                         that.onceMoreDisabled = false;
                         clearTimeout(itemTimer);
                    },500)
                });
                
            })
        }   
    },
}
</script>

<style lang="less">
@import './css/Event.less';
</style>
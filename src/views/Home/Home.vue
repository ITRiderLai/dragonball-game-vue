<template>
    <div class="home">
        <div class="home_body">
            <GamerData></GamerData>
            <div class="char_wrap">
                <ul class="char_list">
                    <li class="char_item pos_rea" v-for="(item,index) in charDataList" :key="index" v-on:click="goForm(index)">
                        <img class="char_head" v-bind:src="item.headImg"/>
                        <span class="char_grade">{{item.grade}}</span>
                    </li>
                </ul>
            </div>
            <div class="message_wrap">
                <div class="lr_container">
                    <div class="message icon"></div>
                    <div class="diamoned icon" @click="getDiamon">{{diamonTime}}</div>
                </div>
                <div class="bag icon" v-on:click="handleGoBar"></div>
            </div>
            <div class="page_bottom">
                <div class="house pos_rea" v-on:click="handleHouseBtn">
                    <div class="enter_house" v-show="enterHouseVisible" v-on:click="handleEnterHouse"></div>
                </div>
                <PageBottom />
            </div> 
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <el-dialog
          title="创建名字"
          custom-class="name-dialog"
          :visible.sync="dialogVisible"
          width="80%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close ="false"
          center>
          <div class="dialog_body">
            <el-input placeholder="请输入名字" v-model="nameValue"/>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="sure_btn" @click="handleCreateName">确定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import GamerData from '../../components/GamerData';
import charData from '../../charData.json';
import {mapMutations,mapGetters} from 'vuex';

import utils from '../../plugins/utils'

export default {
    name:"Home",
    components:{
        PageBottom,
        GamerData
    },
    data() {
        return {
            dialogVisible:false,
            loadingVisible:false,
            enterHouseVisible:false,
            nameValue:"",
            diamonTime: ''
        }
    },
    computed:{
        ...mapGetters('gamerChar',{
            charDataList:'charList'
        })
    },
    created() {
        let that = this;
        //获取页面数据
        this.loadingVisible = true;
        this.axios({
            method:'post',
            url:'/index.php/index/ball/index'
        }).then(res => {
            this.loadingVisible = false;
            if(res.data.status === 402){
                this.$message({
                    message:res.data.msg,
                    type:'success'
                })
                this.$router.push({path:'/'});
                return;
            }
            let gamer_data = res.data.gamer_data
            if(gamer_data.name == null){
                this.dialogVisible = true;
            }
            //初始化sp,vigor,maxVigor,exp,maxExp
            this.initGamerData(gamer_data);
            
            if(res.data.gamer_char.length == 0){
                return;
            }

            let charArr = [];
            res.data.gamer_char.forEach((item)=>{
                let value = charData.filter((param)=>{
                    return item.char_name == param.name;
                })
                let obj = Object.assign({},value[0],item);
                charArr.push(obj)
            });

            // 获取当前时间减去初始登录的时间
            const time = Date.now()
            
            const overTime = time - gamer_data.diamonTime * 1000

            if (overTime > 600000) {

                this.diamonTime = '00:00';

            } else {
                const timeTemp = new Date(600000 - overTime)
                
                const diamonTime = timeTemp.getMinutes() + ':' + (timeTemp.getSeconds() < 10 ? '0' + timeTemp.getSeconds() : timeTemp.getSeconds())

                this.diamonTime = diamonTime

                 this.rewardCountdown()
            }

            
            that.initCharData(charArr);
        })
    },
    methods: {
        ...mapMutations('gamerData', [
            'initGamerData',
            'initName',
            'increDiaCount'
        ]),
        ...mapMutations('gamerChar', ['initCharData']),
        handleGoBar(){
            this.$router.push({path:"/bar"});
        },
        handleCreateName(){
            //检测用户名规则
            let that = this;
            let patt = /^[\u4E00-\u9FA5A-Za-z0-9]{2,8}$/;
            if(!patt.test(this.nameValue)){
                this.$message({
                    message:"名字不能包含特殊字符，且字数为2~8",
                    type:"success"
                })
                return
            }
            //名字输入
            this.axios({
                method:'post',
                url:'/index.php/index/ball/createName',
                data:{
                    name:this.nameValue
                }
            }).then(function(res){
                if(res.data.status === 200){
                    that.dialogVisible = false;
                    that.initName(that.nameValue);
                }
            })
        },
        handleHouseBtn(){
            if(this.enterHouseVisible){
                this.enterHouseVisible = false;
            }else{
                this.enterHouseVisible = true;
            }
        },
        handleEnterHouse(){
            this.$router.push({path:'/house'});
        },
        goForm(index){
            this.$router.push({path:'/form',query:{id:index}});
        },
        
        // 获取钻石
        getDiamon() {
            if (this.diamonTime !== '00:00') return
            this.axios({
                method:'get',
                url:'/index.php/index/ball/getDiamon'
            }).then(() => {
                this.$message({
                    message: '恭喜获得钻石+10',
                    type:'success'
                })
                this.diamonTime = '10:00'
                this.rewardCountdown()
                this.increDiaCount(10)
            })
        },

        // 奖励倒计时
        rewardCountdown() {
            utils.handleTimeReciprocal(this.diamonTime, (res) => this.diamonTime = res)
        }
    }
}
</script>

<style lang="less">
@import "./css/home.less";
</style>
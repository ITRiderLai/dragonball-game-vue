<template>
    <div id="Adjust">
        <div class="adjust_header">
            <button class="close_btn" v-on:click="goBack"></button>
        </div>
        <div class="adjust_body">
            <ul class="adjust_list">
                <li class="adjust_item" v-for="(item, index) in charList" :key="index" v-on:click="handleSelected(index)">
                    <div class="char_item">
                        <img v-bind:src="item.headImg"/>
                    </div>
                    <div class="char_name">
                        <h3>{{item.title}}</h3>
                    </div>
                    <div class="char_skill">
                        <img  v-for="(skill) in item.skill" :key="skill.id" v-bind:src="skill.img"/>
                    </div>
                    <div class="adjust_btn">
                        <button v-show="selectedIndex == index ? false : selected" v-on:click="handleAdjust(index)"></button>
                    </div>
                </li>
            </ul>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="adjust_footer">
            <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import {mapActions,mapGetters} from 'vuex'
export default {
    name:"Adjust",
    components:{
        PageBottom
    },
    data() {
        return {
            loadingVisible:false,
            selected : false,
            selectedIndex:null
        }
    },
    computed:{
        ...mapGetters('gamerChar',[
            'charList'
        ])
    },
    methods: {
        ...mapActions('gamerChar',[
            'adjustChar'
        ]),
        goBack(){
            this.$router.go(-1);
        },
        handleSelected(index){
            if(this.selected == false){
                this.selected = true;
            }else{
                this.selected = false;
            }
            this.selectedIndex = index;
        },
        handleAdjust(index){
            this.loadingVisible = true;
            let obj = {
                    index:this.selectedIndex,
                    currentIndex:index
            }
            this.axios({
                method:'post',
                url:"/index.php/index/ball/adjust",
                data:{
                    index:this.selectedIndex,
                    currentIndex:index
                }
            }).then(()=>{
                this.loadingVisible = false;
                this.adjustChar(obj);
            }).catch(res=>{
                this.$message({
                    message:res,
                    type:"error"
                })
            })
            
        }
    },
}
</script>

<style lang="less">
@import '../../css/mixin';
#Adjust{
    .adjust_header{
        width: 100%;
        height: 4.6rem;
        .bgs("/image/adjust_top.png",100%);
        text-align: right;
        .close_btn{
            .wh(2rem,2rem);
            margin: 2rem 1rem 0 0;
            background: url(/image/home_icon.png) no-repeat;
            background-size: 35rem;  
            background-position: -27rem -2.5rem;
        }
    }
    .adjust_body{
        font-size: 0.6rem;
        .adjust_item{
            .bgs("/image/adventure_bg.png",100%);
            .flex();
            margin-bottom: 0.1rem;
        }
        .char_item{
            .flexw(2);
            text-align: center;
            padding: 1.2rem 0 0.2rem;
            img{
                .wh(3.5rem,3.5rem);
            }
        }
        .char_name{
            .flexw(1);
            h3{
                line-height: 1.5rem;
            }
        }
        .char_skill{
            .flexw(3);
            text-align: center;
            padding-top: 2rem;
            img{
                .wh(2rem,2rem);
                margin: 0 0.5rem;
            }
        }
        .adjust_btn{
            .flexw(2);
            text-align: right;
            padding-top: 1rem;
            button{
                .wh(2.2rem,3.5rem);
                margin-right: 0.5rem;
                background: url(/image/home_icon.png) no-repeat;
                background-size: 36rem;  
                background-position: -20.4rem -7.6rem;
            }
        }
    }
}
</style>
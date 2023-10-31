<template>
    <div id="InstanceItem">
        <div class="instanceItem_header">
            <GamerData></GamerData>
        </div>
        <div class="instanceItem_body">
            <div class="level_tabs font_seven_white">
                <ul class="level_tabs_list">
                    <li class="level_tabs_item" v-for="(item, index) in instance_data" :key="index" v-bind:style="{opacity:titleIndex < index  ? '0.7' : '1'}" v-on:click="handleLevelTabs(index)">
                        {{item.title}}
                    </li>
                </ul>
            </div>
            <ul class="level_list">
                <li class="level_item pos_rea" v-for="(item,index) in levelProgress" :key="index">
                    <div class="mask pos_abs" v-show="index > chapterIndex && levelIndex >= titleIndex ? true : false"></div>
                    <h6 class="text_center">{{item.order}}</h6>
                    <p class="level_txt">{{item.txt}}</p>
                    <div class="level_change flex_wrap">
                        <div class="level_progress flex_one">
                            <p class="desc">Progress</p>
                            <p v-if="item.hasOwnProperty('recomended')">Battle</p>
                        </div>
                        <div class="level_quest text_center">
                            <p class="desc">requisites</p>
                            <div class="vigor_desc pos_rea">
                                <i class="vigor pos_abs"></i>
                                <p>{{item.vigor}}</p>
                            </div>
                            <button class="perform_btn" v-bind:disabled="index > chapterIndex && levelIndex >= titleIndex ? 'disabled' : null" v-on:click="handlePerform(item,index)">Perform</button>
                        </div>
                        <div class="level_rewords flex_one">
                            <p class="desc text_right">rewards</p>
                            <div class="rewords_desc">
                                <div class="exp_coin_desc pos_rea">
                                    <i class="exp pos_abs"></i>
                                    <p>{{item.exp}}</p>
                                </div>
                                <div class="exp_coin_desc pos_rea">
                                    <i class="coin pos_abs"></i>
                                    <p>{{item.coin}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="instanceItem_footer">
            <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import GamerData from '../../components/GamerData';
import InstanceData from '../../InstanceData.json';
import {mapState,mapMutations} from 'vuex';
export default {
    name:"InstanceItem",
    components:{
        PageBottom,
        GamerData
    },
    data() {
        return {
            instance_data:[],
            levelIndex:0,
            loadingVisible:false
        }
    },
    created() {
        
        this.instance_data = InstanceData.InstanceItem[this.$route.query.level];
        
    },
    computed:{
        ...mapState('gamerData',[
            'instanceLevel',
            'chapterId',
            'vigorCount'
        ]),
        titleIndex(){
            return this.chapterId.split('&')[0];
        },
        chapterIndex(){
            return this.chapterId.split('&')[1];
        },
        levelProgress(){
            return this.instance_data[this.levelIndex].content;
        }
    },
    methods: {
        ...mapMutations('gamerData',[
            'initGamerData'
        ]),
        handleLevelTabs(index){
            if(this.titleIndex < index){
                return;
            }
            this.levelIndex = index;
        },
        handlePerform(item,index){
           if(item.vigor > this.vigorCount){
               this.$message({
                   message:"体力不足",
                   type:"error"
               })

               return;
           }
            this.loadingVisible = true;
           if('recomended' in item){
                item.chapter_id && (item.chapter_id = item.chapter_id.split('&')[0] - 1 < this.chapterId.split('&')[0] ? null : item.chapter_id)
                this.$router.push({path:'/war',query:{cate:"instance",data:item}});
                return;
           }
           let instanceLevel = this.instanceLevel;
           let chapter_id = this.chapterId;

           if(this.levelIndex == this.titleIndex && this.chapterIndex == index && this.chapterIndex != this.levelProgress.length - 1){      //挑战最新内容但并不是最后内容
               
               let chapter = parseInt(this.chapterIndex) + 1;
               chapter_id = this.titleIndex + '&' + chapter;

           }else if(this.levelIndex == this.titleIndex && this.chapterIndex == index && this.chapterIndex == this.levelProgress.length - 1){    //挑战最新内容并且是最后的内容
               
               chapter_id = parseInt(this.titleIndex) + 1 + '&' + 0;
 

           }else if(this.titleIndex == this.instance_data.length-1 && this.chapterIndex == this.levelProgress.length - 1){      //挑战最新章节内容跳转到新章节
               instanceLevel = parseInt(this.instanceLevel) + 1;
               chapter_id = '0&0';
 
           }
           this.axios({
               method:'post',
               url:'/index.php/index/ball/perform',
               data:{
                    vigor:item.vigor,
                    exp:item.exp,
                    coin:item.coin,
                    instance_level:instanceLevel,
                    chapter_id:chapter_id
               }
           }).then(res=>{
               this.loadingVisible = false;
               this.initGamerData(res.data);
           })
        }
    },
}
</script>

<style lang="less">
@import './css/InstanceItem.less';
</style>
<template>
    <div id="Adventure">
        <div class="adventure_header">
            <button class="btn chance font_seven_white">排位战</button>
            <div class="sp_wrap font_seven_white pos_rea">
                <span class="wrap text_center">{{spCount}}/10</span>
            </div>
        </div>
        <div class="adventure_body">
            <ul class="adventure_list">
                <li class="adventure_item flex_wrap" v-for="(item, index) in sortRank" :key="index">
                    <div class="grade_wrap flex_two">
                        <h5>LV.{{item.grade}}</h5>
                        <p class="merit">Every 10 minutes +{{item.min_merit}} merit</p>
                    </div>
                    <div class="name_wrap flex_three">
                        <p  class="name">{{item.name}}</p>
                        <ul class="char_list flex_wrap">
                            <li class="char_item" v-for="(param, index) in item.char.slice(0,3)" :key="index">
                                <img v-bind:src="param.headImg">
                            </li>
                        </ul>
                    </div>
                    <div class="rank_wrap flex_one">
                        <p class="text_right">Rank:{{item.rank}}</p>
                        <ConfirmBtn class="challenge" btn-txt="挑战" v-if="item.name != currentRank.name" @click.native="goBattle(item.char,item.current_zl,item.rank)" ></ConfirmBtn>
                    </div>
                </li>
            </ul>
            <div class="rank_data flex_wrap">
                <div class="current_merit flex_three">
                    <h3>{{currentRank.name}}</h3>
                    <div class="merit">
                        <span class="merit_title">Current Merit</span>
                        <div class="merit_bar pos_rea">
                            <i class="merit_icon pos_abs"></i>
                            <p class="txt">{{meritCount}}</p>
                        </div>
                    </div>
                    <p>Every 10 mins will receive {{currentRank.min_merit}} merit</p>
                </div>
                <div class="current_rank flex_one">
                    <h3>Rank:{{currentRank.rank}}</h3>
                    <ConfirmBtn btn-txt="刷新" @click.native="getRank"></ConfirmBtn>
                </div>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="adventure_footer">
            <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import charData from '../../charData.json';
import {mapState} from 'vuex';
export default {
    name:"Adventure",
    components:{
        PageBottom,
    },
    data() {
        return {
            currentRank:{},
            loadingVisible:false,
            rankList:[]
        }
    },
    computed:{
        ...mapState('gamerData',[
            'spCount',
            'meritCount',
            'name'
        ]),
        sortRank(){
           let arr = this.$utils.deepClone(this.rankList);
           return arr.sort((n1,n2)=>{
                return n1.rank - n2.rank;
            })
        }
    },
    created() {
        this.getRank();
    },
    methods:{
        getRank(){
            this.loadingVisible = true;
            this.axios({
                method:"post",
                url:"/index.php/index/ball/rank"
            }).then((res)=>{
                this.loadingVisible = false;
                let data = res.data;
                data.forEach((item)=>{
                    item.char.forEach((param)=>{
                        let val = charData.find(n=>n.name == param.char_name);
                        Object.assign(param,val);
                    })
                });
                this.rankList = data;            
                this.currentRank = data.filter((item)=>{
                    return this.name == item.name;
                })[0]
                
            })
        },
        goBattle(char,zl,rank){
            if(this.spCount == 0){
                this.$message({
                    message:"sp不足",
                    type:'error'
                })
                return;
            }
            this.$router.push({path:'/war',query:{cate:"rank",data:{enemy:char,recomended:zl,rank:rank}}});
        }
    }
}
</script>

<style lang="less">
@import '../../css/mixin';
#Adventure{
    font-size: 0.6rem;
    .adventure_header{
        padding: 1.9rem 0.5rem 0.5rem;
        .bgs("/image/adventure_top.png",100%);
        .btn{
            .wh(4.65rem,1.5rem);
            text-align: center;
            line-height: 1.8rem;
            font-size: 0.6rem;
            text-shadow: 1px 1px black;
        }
        .chance{
            background: url("/image/home_icon.png") no-repeat;
            background-size: 50rem;
            background-position: -38.53rem -7.1rem;
        }
        .close{
            float: right;
            .wh(1.5rem,1.5rem);
            background: url("/image/home_icon.png") no-repeat;
            background-size: 35rem;
            background-position: -27.25rem -2.7rem;
        }
        .sp_wrap{
            float: right;
            .wh(5rem,1.2rem);
            padding:0.1rem 0.5rem 0 1rem;
            .wrap{
                display: block;
                line-height: 1.2rem;
                background-color: #1e3546;
                border: 1px solid #ffffff;
                border-radius: 3px;
            }
            &::after{
                content: "";
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                .wh(2rem,1.5rem);
                background: url("/image/home_icon.png") no-repeat;
                background-size: 30rem;
                background-position: -19.5rem -2rem;
            }
        }
    }
    .adventure_body{
        padding: 0 0.2rem;
        background-color: #fff4de;
        .adventure_list{
            height: 68vh;
            overflow: hidden;
            overflow-y: scroll;
        }
        .adventure_item{
            position:relative;
            top:0;
            left:0;
            padding: 0.3rem 1rem;
            .bgs("/image/adventure_bg.png",100%);
            .merit{
                padding: 1rem 0rem;
            }
            .name{
                padding-left: 1rem;
            }
            .char_list{
                margin-top: 0.8rem;
            }
            .char_item{
                .wh(2rem,2rem);
                margin: 0 0.1rem;
                img{
                    width: 100%;
                }
            }
            .challenge{
                .cz();
                right:0.5rem;
            }
        }
        .rank_data{
            padding:0.5rem 0.5rem 1rem;
            .bgs('/image/form_sx_bg.png',100%);
            .merit_title{
                float: left;
                line-height: 1.5rem;
            }
            .merit_bar{
                .wh(5rem,1.5rem);
                margin-left: 5rem;
                padding:0.25rem 0 0 1rem;
                .merit_icon{
                    .wh(1.5rem,1.5rem);
                    background: url("/image/home_icon.png") no-repeat;
                    background-size: 17rem;
                    background-position:-5.9rem -3.7rem;
                }
                .txt{
                    text-align: center;
                    background-color: #1e3546;
                    border: 1px solid #ffffff;
                    border-radius: 3px;
                    color: white;
                }
            }
            .current_rank{
                text-align:right;
                h3{
                    margin-bottom:0.5rem;
                }
            }
        }
    }
}
</style>
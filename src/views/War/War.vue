<template>
    <div id="War">
        <div class="page_body">
            <div class="enemy_box">
                <div class="enemy_bar bar">
                    <ul class="enemy_list">
                        <li class="char_item enemy_item pos_rea" v-for="(item, index) in enemyCharArr" :key="index">
                            <span class="grade text_center">{{item.grade}}</span>
                            <img v-bind:src="item.headImg"/>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="battle flex_wrap">
                <div class="self_char char_box">
                    <img class="char self" v-bind:src="selfChar.charImg" :style="{width: charImgWidth, height: charImgHeight}">
                    <img v-if="selfCharSikllShow" :src="selfCharSikllShow" style="width: 100px; height: 100px; position: absolute; left: 0">
                    <div class="char_info self_info">
                        <div class="star_grade">
                            <div class="star_wrap">
                                <i class="star" v-for="(item, index) in selfChar.star" :key="index"></i>
                            </div>
                            <div class="char_grade">
                                LV.{{selfChar.grade}}
                            </div>
                        </div>
                        <p class="name text_center">{{selfChar.title}}</p>
                        <p class="zl text_center">{{selfChar.current_zl}}</p>
                        <p class="zl text_center" v-if="selfCharSikllName" style="margin-top: 10px;">使用了{{ selfCharSikllName }}</p>
                    </div>
                </div>
                <div class="enemy_char char_box">
                    <img class="char enemy" v-bind:src="enemyChar.charImg"/>
                    <img v-if="enemyCharSikllShow" :src="enemyCharSikllShow" style="width: 100px; height: 100px; position: absolute; right: 0">
                    <div class="char_info enemy_info">
                        <div class="star_grade">
                            <div class="star_wrap">
                                <i class="star" v-for="(item, index) in enemyChar.star" :key="index"></i>
                            </div>
                            <div class="char_grade">
                                LV.{{enemyChar.grade}}
                            </div>
                        </div>
                        <p class="name text_center">{{enemyChar.title}}</p>
                        <p class="zl text_center">{{enemyChar.current_zl}}</p>
                        <p class="zl text_center" v-if="enemyCharSikllName" style="margin-top: 10px;">使用了{{ enemyCharSikllName }}</p>
                    </div>
                </div>
            </div>
            <div class="self_bar bar">
                <ul class="self_list">
                    <li class="char_item self_item pos_rea" v-for="(item, index) in selfCharArr" :key="index">
                          <span class="grade text_center">{{item.grade}}</span>
                          <img v-bind:src="item.headImg"/>
                    </li>
                </ul>
            </div>
            <svg class="self_svg">
                <path d="M0 -20 L30 0 L0 20 L0 10 L50 0 L0 10" />
            </svg>
            <svg class="enemy_svg">
                <path d="M0 10 L-30 0 L0 -30 L0 -10 L-50 0 L0 0" />
            </svg>
            <button class="skip" v-on:click="goBack"></button>
        </div>
        <el-dialog
         custom-class="fail-dialog status-dialog"
         :visible.sync="dialogVisible"
         width="100%"
         top="5vh"
         :show-close="false"
         :close-on-click-modal="false"
         :close-on-press-escape="false"
        >
            <div class="vs_info flex_wrap">
                <div class="me_info flex_one">
                    <p>{{name}}</p>
                    <p>Total Atk:{{zlCount}}</p>
                </div>
                <div class="enemy_info flex_two">
                    <p>Enemy</p>
                    <p>Total Atk:{{recomended}}</p>
                </div>
            </div>
        </el-dialog>
        <el-dialog
         custom-class="success-dialog status-dialog"
         :visible.sync="successDialog"
         width="100%"
         top="1vh"
         :show-close="false"
         :close-on-click-modal="false"
         :close-on-press-escape="false"
        >
            <div class="vs_info flex_wrap">
                <div class="me_info flex_one">
                    <p>{{name}}</p>
                    <p>Total Atk:{{zlCount}}</p>
                </div>
                <div class="enemy_info flex_two">
                    <p>Enemy</p>
                    <p>Total Atk:{{recomended}}</p>
                </div>
            </div>
            <div class="rewords_desc">
                <ul class="rewords_list flex_wrap">
                    <li class="exp_coin_desc pos_rea">
                        <i class="exp pos_abs"></i>
                        <p>{{coin_exp.exp}}</p>
                    </li>
                    <li class="exp_coin_desc pos_rea">
                        <i class="coin pos_abs"></i>
                        <p>{{coin_exp.coin}}</p>
                    </li>
                    <li class="exp_coin_desc pos_rea">
                        <i class="vigor pos_abs"></i>
                        <p class="vigor_txt">---</p>
                    </li>
                </ul>
                <img v-bind:src="reword.img"/>
                <div class="rewords_name">{{reword.name}}</div>
            </div>
        </el-dialog>
        <button class="back" v-on:click="goBack" v-if="backVisible"></button>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <!-- 技能声效 -->
        <audio :src="skillAudio" ref="audio" hidden="true"></audio>
        <audio src="/audio/pk.mp3" ref="audioPk" hidden="true"></audio>
    </div>
</template>

<script>
import {mapGetters,mapState,mapMutations} from 'vuex';
import charData from '../../charData.json';
import itemData from '../../itemData.json';
import anime from 'animejs';
import { Skill } from './skill'

export default {
    name:'War',
    data() {
        return {
            selfCharArr:[],
            enemyCharArr:[],
            dialogVisible:false,
            recomended:0,
            successDialog:false,
            backVisible:false,
            reword:{},
            coin_exp:{},
            loadingVisible:false,
            selfCharSikllShow: '',
            enemyCharSikllShow: '',
            selfCharSikllName: '',
            enemyCharSikllName: '',
            skillAudio: '/audio/skill.mp3',
            charImgWidth: '',
            charImgHeight: ''
        }
    },
    computed:{
        ...mapState('gamerData',[
            'name',
            'zlCount'
        ]),
        ...mapGetters('gamerChar',[
            'charList'
        ]),
        selfChar(){
            return this.selfCharArr[0];
        },
        enemyChar(){
            return this.enemyCharArr[0];
        }
    },
    created() {
        this.selfCharArr = this.$utils.deepClone(this.charList);
        this.enemyCharArr = this.$utils.deepClone(this.$route.query.data.enemy);
        this.recomended = this.$route.query.data.recomended;
    },
    mounted() {
        this.play();
    },
    methods: {
        ...mapMutations('gamerData',[
            'initGamerData'
        ]),
        play(){
            let cate = this.$route.query.cate;
            let battleInfo = this.$route.query.data;
            let path = anime.path('.self_svg path');
            let enemyPath = anime.path('.enemy_svg path')

            // 前置（技能触发）
            const JN = new Skill({selfChar: this.selfChar, enemyChar: this.enemyChar, selfList: this.selfCharArr, enemyList: this.enemyCharArr})
            
            JN.init()
            const info = JN.start()

            const selfInfo = info.selfInfo
            const enemyInfo = info.enemyInfo

            const delay = selfInfo.time > enemyInfo.time ? selfInfo.time : enemyInfo.time
            // 新增或减少自己战力
            if (selfInfo.addZl) {
                console.log('selfInfo', selfInfo)
            }
            if (enemyInfo.addZl) {
                console.log('enemyInfo', enemyInfo.addZl)
            }
            if (selfInfo.show) {
                this.$refs.audio.play();
                setTimeout(() => {
                    selfInfo.target === 'self' ? this.selfCharSikllShow = selfInfo.show : this.enemyCharSikllShow = selfInfo.show
                    this.selfCharSikllName =  selfInfo.name
                }, 500)
            }

            if (enemyInfo.show) {
                this.$refs.audio.play();
                setTimeout(() => {
                    enemyInfo.target === 'self' ? this.enemyCharSikllShow = enemyInfo.show : this.selfCharSikllShow = enemyInfo.show
                    this.enemyCharSikllName =  enemyInfo.name
                }, 500)
            }
            
            setTimeout(() => {
                selfInfo.target === 'self' ? this.selfCharSikllShow = '' : this.enemyCharSikllShow = ''
            }, selfInfo.time)

            setTimeout(() => {
                enemyInfo.target === 'self' ? this.enemyCharSikllName = '' : this.selfCharSikllShow = ''
            }, enemyInfo.time)

            setTimeout(() => {
                this.selfCharSikllName = ''
                this.enemyCharSikllName = ''
                this.$refs.audioPk.currentTime = 0;
                this.$refs.audioPk.play();
            }, delay - 100)

            anime({
                targets:'.self',
                translateX: path('x'),
                translateY: path('y'),
                easing: 'linear',
                duration: 500,
                delay: delay
                // loop: true
            }).finished.then(()=>{
                this.$refs.audioPk.pause();
                let current_zl = this.selfChar.current_zl - this.enemyChar.current_zl
                if(current_zl >= 0){
                    this.selfChar.winner = true
                    this.selfChar.current_zl = current_zl;
                    if(this.enemyCharArr.length == 1 ){
                        this.loadingVisible = true;
                        let url = "";
                        let reword = {};
                        switch(cate){
                            case "instance":
                                url="/index.php/index/ball/getReword";
                                reword = {
                                    coin:battleInfo.coin,
                                    exp:battleInfo.exp,
                                    vigor:battleInfo.vigor,
                                    instance_level:battleInfo.instance_level,
                                    chapter_id:battleInfo.chapter_id
                                };
                                this.coin_exp = {
                                    coin:battleInfo.coin,
                                    exp:battleInfo.exp
                                }
                                break;
                            case "rank":
                                url="/index.php/index/ball/getRank";
                                reword = {
                                    coin:3000,
                                    sp:1,
                                    rank:battleInfo.rank
                                };
                                this.coin_exp = {
                                    coin:3000,
                                    exp:"-"
                                }
                        }
                        this.axios({
                            method:'post',
                            url:url,
                            data:reword
                        }).then(res=>{
                            this.loadingVisible = false;
                            this.successDialog = true;
                            this.backVisible = true;
                            let data = res.data;
                            let val = {};
                            switch(data.cate){
                                case 'char':
                                    val = charData.find(item=>item.name == data.reword.char_name);
                                    this.reword = {name:val.title,img:val.headImg};
                                    break;      
                                case 'item':
                                    val = itemData.find(item=>item.id == data.reword);
                                    this.reword = {name:val.name,img:val.path};
                                    break;
                                case 'equip':
                                    this.reword = {name:data.reword.title,img:data.reword.img};
                                    break;
                                
                            }
                            this.initGamerData(res.data.data);
                        })
                        return;
                    }
                    this.enemyCharArr.shift();
                }else{
                    this.enemyChar.current_zl = this.enemyChar.current_zl - this.selfChar.current_zl;
                    if(this.selfCharArr.length == 1 ){
                        this.backVisible = true;
                        this.dialogVisible = true;
                        return;
                    }
                    this.selfCharArr.shift();
                }
                this.play();
            });
            anime({
                targets:'.enemy',
                translateX: enemyPath('x'),
                translateY: enemyPath('y'),
                easing: 'linear',
                duration: 500,
                delay: delay
            });
        },
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="less">
#War{
    .page_body{
        width:100vw;
        height:100vh;
        background:url(/image/battle_bg.jpg) no-repeat;
        background-size:100%;
        .enemy_box{
            &::after{
                content:"";
                display:block;
                clear:both;
            }
        }
        .bar{
            width:14rem;
            height:5rem;
        }
        .enemy_bar{
            float:right;
            background:url(/image/battle_char_bar.png) no-repeat;
            background-size:100%;
        }
        .self_bar{
            position:absolute;
            bottom:0;
            background:url(/image/battle_char_bar_self.png) no-repeat;
            background-size:100%;
        }
        .enemy_list{
            padding:0.3rem 0 0 1.2rem;
            height:3rem;
            width:12.5rem;
            overflow:hidden;
                &::after{
                    content:"";
                    display:block;
                    clear:both;
                
                }
                .enemy_item{
                    float:left;
                }
        }
        .self_list{
            padding:1.6rem 1.2rem 0 0;
            height:3rem;
            width:13rem;
            overflow:hidden;
            &::after{
                content:"";
                display:block;
                clear:both;
            }
            .self_item{
                float:right;
            }
        }
        .char_item{
            width:3rem;
            height:3rem;
            margin-right:0.2rem;
            img{
                width:100%;
            }
            .grade{
                position:absolute;
                top:0;
                right:0.15rem;
                display:block;
                width:0.6rem;
                height:0.6rem;
                color:white;
                font-size:0.6rem;
                transform:scale(0.7);
            }
        }
        .battle{
            margin-top:5rem;
            justify-content:space-between;
        }
        .char{
            width:4rem;
        }
        .char_box{
            color:#69b0cd;
            img{
                margin:0 0 1rem 1rem;
            }
            .char_info{
                width:6rem;
                height:3rem;
                font-size:0.6rem;
                font-weight:700;
                .star_grade{
                    &::after{
                        content:"";
                        display:block;
                        clear:both;
                    }
                }
            }
            .char_grade{
                color:#a4f425;
            }
        }
        .self_char{
            padding-top:4rem;
            .star_wrap{
                float:left;
            }
            .char_grade{
                float:right;
                text-shadow: 1px 1px black;
            }
            .self_info{
                background:url(/image/battle_char_info_left.png) no-repeat;
                background-size:100%;
            }
            .name{
            color:#f3b91e;
            }
        }
        .enemy_char{
            padding-top:2rem;
            .star_wrap{
                float:right;
            }
            .char_grade{
                float:left;
                text-shadow: 1px 1px black;
            }
            .enemy_info{
                background:url(/image/battle_char_info.png) no-repeat;
                background-size:100%;
            }
        }
        .star{
            display:inline-block;
            width:0.7rem;
            height:0.7rem;
            background:url(/image/home_icon.png) no-repeat;
            background-size: 17rem;     
            background-position: -11.5rem -4.3rem
        }
        .skip{
            position:absolute;
            right:0;
            bottom:3rem;
            width:3rem;
            height:1.7rem;
            background:url(/image/home_icon.png) no-repeat;
            background-size: 80rem;
            background-position: -74.8rem -19.9rem
        }
    }
    .self_svg{
        position:absolute;
        visibility: hidden;
    }
    .enemy_svg{
        position:absolute;
        visibility: hidden;
    }
    .status-dialog{
        box-shadow:none;
        .el-dialog__header{
            padding:0;
        }
        .el-dialog__body{
            font-size:0.6rem;
            font-weight:600;
        }
        .me_info{
            text-align:left;
        }
        .enemy_info{
            text-align:right;
        }
        p{
            line-height:1.5rem;
        }
    }
    .fail-dialog{
        height:15rem;
        background:url(/image/fail.png) no-repeat;
        background-size:100%;
        .el-dialog__body{
            padding:10rem 2rem 0;
        }
    }
    .success-dialog{
        height:27rem;
        background:url(/image/battle_success.png) no-repeat;
        background-size:100%;
        .el-dialog__body{
            padding:9.5rem 2rem 0;
        }
        .rewords_desc{
            margin-top:3rem;
            .exp_coin_desc{
                padding-left: 3rem;
                .exp{
                    display: block;
                    left: 1rem;
                    width: 1.5rem;
                    height: 1rem;
                    background: url("/image/home_icon.png") no-repeat;
                    background-size: 20rem;
                    background-position: -17.3rem -3.8rem
                }
                .coin{
                    display:block;
                    left: 1.5rem;
                    width:1rem;
                    height:1rem;
                    background:url("/image/home_icon.png") no-repeat;
                    background-size:16rem;
                    background-position:-6.8rem -0.2rem;
                }
                .vigor{
                    display: block;
                    left: 1.5rem;
                    width: 1.5rem;
                    height: 1rem;
                    background: url("/image/home_icon.png") no-repeat;
                    background-size: 20rem;
                    background-position: -13.2rem -0.25rem;
                }
                p{
                    line-height: 1rem;
                }
                .vigor_txt{
                    padding-left:0.5rem;
                }
            }
            img{
                display:block;
                margin:2rem auto 0;
                width:3rem;
                height:3rem;
            }
            .rewords_name{
                color: white;
                margin:0 auto;
                width: 4.5rem;
                height: 2rem;
                text-align: center;
                line-height: 2rem;
                font-size: 0.6rem;
                background: url("/image/home_icon.png") no-repeat;
                background-size: 50rem;
                background-position: -38.2rem -0.85rem;
            }
        }
    }
    .back{
            position:absolute;
            right:0;
            bottom:3rem;
            width:3rem;
            height:2.5rem;
            background:url(/image/home_icon.png) no-repeat;
            background-size: 80rem;
            background-position: -66rem -22.5rem;
            z-index:9999;
    }
}
</style>
<template>
    <div class="form">
        <div class="form_header">
            <div class="form_battle">
                <Battle></Battle>
            </div>
            <div class="char_wrap pos_rea">
                <button class="adjust_btn pos_abs" v-on:click="goAdjust"></button>
                <ul class="char_list">
                    <li class="char_item pos_rea"  v-for="(item,index) in charDataList" :key="index" v-on:click="handleCharChange(index)">
                        <img class="char_head" v-bind:src="item.headImg"/>
                        <span class="char_grade">{{item.grade}}</span>
                    </li>
                    <li class="add_char char_item" v-if="charDataList.length < 6 ? true : false" v-on:click="goAdd"></li>
                </ul>
            </div>
        </div>
        <div class="form_body pos_rea">
            <div class="mes_wrap">
                <div class="mes_lf">
                    <div class="name pos_rea">
                        <p class="grade">LV.{{charDetail.grade}}</p> 
                        <span class="name_txt">{{charDetail.title}}</span>
                    </div>
                    <div class="zl_fy_wrap">
                        <div class="zl_fy_item pos_rea">
                            <i class="zl_icon icon pos_abs"></i>
                            <div class="txt">{{charDetail.current_zl}}</div>
                        </div>
                    </div>
                    <div class="replace_wrap">
                        <button class="btn font_seven_white replace" v-on:click="goRelace('warrior')">替换</button>
                        <button class="btn font_seven_white enhance" v-on:click="goEnhance('warrior')">升级</button>
                    </div>
                </div>
                <div class="mes_ct" v-on:click="goCharDetail">
                    <img class="char" v-bind:src="charDetail.charImg"/>
                </div>
                <div class="mes_rt">
                    <div class="zb_wrap pos_rea">
                        <div class="zb_item wq_icon pos_rea" v-on:click="handleEquipBtn">
                            <div class="equip_btn" v-show="equipVisible">
                                <button class="replace btn pos_abs" v-on:click="goRelace('equip')"></button>
                                <button  class="enhance btn pos_abs" v-on:click="goEnhance('equip')"></button>
                                <button  class="info btn pos_abs" v-on:click="goInfo(charDetail.equip)"></button>
                            </div>
                            <img v-bind:src="charDetail.equip_id == null ? '/image/equip/add_weapon.png' : charDetail.equip.img"/>
                            <span class="grade pos_abs" v-if="charDetail.equip_id == null ? false: true">LV.{{charDetail.equip.grade}}</span>
                        </div>
                        <div class="zb_name">
                            {{charDetail.equip_id == null ? '-' :charDetail.equip.title}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="form_sx">
                <div class="skill_wrap">
                    <div class="skill_box">skill</div>
                    <div class="skill_txt" v-if="charDetail.skill.length != 0" >
                        <div class="txt" v-for="(param, index) in charDetail.skill" :key="index">{{param.name}}</div>
                    </div>
                </div>
                <div class="karma_wrap">
                    <div class="karma_box">karma</div>
                    <ul class="karma_txt_wrap">
                        <li v-for="(item, index) in charDetail.Kama" :key="index" :class="['karma', {active: charDetail[item.rela] === 1}]">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="form_footer">
            <PageBottom/>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import Battle from '../../components/Battle';
import {mapGetters} from 'vuex';
export default {
    name:"Form",
    components:{
        PageBottom,
        Battle
    },
    data() {
        return {
            charDetail:{},
            charIndex:0,
            equipVisible:false
        }
    },
    computed:{
        ...mapGetters('gamerChar',{
            charDataList:'charList'
        })
    },
    created() {
        let index = this.$route.query.id;
        this.charIndex = index;
        this.charDetail = this.charDataList[index];
    },
    methods: {
        goCharDetail(){
            this.$router.push({path:"/charDetail",query:{char:this.charIndex}});
        },
        handleCharChange(index){
            this.charIndex = index;
            this.charDetail = this.charDataList[index];
        },
        goAdjust(){
            this.$router.push({path:'/adjust'});
        },
        goAdd(){
            this.$router.push({path:'/replace',query:{cate:'warrior',id:this.charDataList.length}});
        },
        goRelace(cate){
            this.$router.push({path:'/replace',query:{cate:cate,id:this.charIndex}});
        },
        goEnhance(cate){
            this.$router.push({path:'/enhance',query:{cate:cate,id:this.charIndex}});
        },
        handleEquipBtn(){
            if(this.charDetail.equip_id == null){
                this.$router.push({path:'/replace',query:{cate:'equip',id:this.charIndex}});
            }
            if(this.equipVisible == true){
                this.equipVisible = false;
            }else{
                 this.equipVisible = true;
            }
        },
        goInfo(val){
            this.$router.push({path:'/equipInfo',query:{info:val}});
        }
    },
}
</script>

<style lang="less">
@import './css/form.less';
</style>
<template>
    <div class="char_detail">
        <div class="char_header">
            <button class="close_btn" v-on:click="goBackHis"></button>
        </div>
        <div class="char_body">
            <div class="char_info_wrap">
                <div class="char_data pos_rea">
                    <div style="height: 6.75rem;">
                        <div class="grade_start pos_abs">
                            <span class="grade">Lv.{{charDetail.grade}}</span>
                            <div class="start_wrap">
                                <i class="start" v-for="(item, index) in charDetail.star" :key="index"></i>
                            </div>
                        </div>
                        <img class="char" v-bind:src="charDetail.charImg"/>
                        <p class="char_name">{{charDetail.title}}</p>
                    </div>
                    <div class="zl_fy">
                        <div class="zl_wrap pos_rea">
                            <i class="zl_icon icon pos_abs"></i>
                            <p class="txt">{{charDetail.current_zl}}</p>
                        </div>
                    </div>
                </div>
                <div class="char_mes">
                    <div class="mes_box">
                        <div class="info">
                            <span>info</span>
                        </div>
                        <div class="info_txt">
                            {{charDetail.info}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="skill_wrap">
                <div class="skill_title">
                    <div class="title">skill</div>
                </div>
                <div class="skill" v-for="(item, index) in charDetail.skill" :key="index">
                    <div class="skill_img" v-on:click="() => openSkillDetail(item)">
                        <img v-bind:src="item.img"/>
                    </div>
                    <div class="skill_name">{{item.name}}</div>
                </div>
                <div class="skill" v-if="charDetail.skill.length === 1"></div>
            </div>
            <div class="karma_wrap">
                <div class="karma_title">
                    karma
                </div>
                <div class="karma_box">
                    <ul class="karma_list">
                        <li class="karma_item" v-for="(item, index) in charDetail.Kama" :key="index">
                            <div class="txt">
                                {{item.name}}
                            </div>
                            <span class="des">{{item.txt}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 技能弹出框 -->
        <el-dialog
        custom-class="skill-dialog"
        :visible.sync="dialogVisible"
        width="90%"
        :show-close ="false"
        center>
            <div slot="title" class="el-dialog__title">
                <i class="close_btn" v-on:click="handleClose"></i>
            </div>
            <div class="dialog_body">
                <div class="skill_title">
                    <img class="skill_img" :src="skillDetail.img"/>
                    <div class="txt">
                        {{skillDetail.name}}
                    </div>
                </div>
                <div class="skill_info">
                    <h4 class="title">
                        introduction
                    </h4>
                    <p class="desc">
                        {{skillDetail.intro}}
                    </p>
                </div>
            </div>  
        </el-dialog>
        <div class="char_footer">
            <PageBottom/>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
export default {
    name:"CharDetail",
    components:{
        PageBottom
    },
    data() {
        return {
             dialogVisible: false,
             charDetail:{},
             skillDetail: {}
        }
    },
    created() {
        this.charDetail = this.$store.state.gamerChar.charData[this.$route.query.char];
    },
    methods: {
        handleClose(){
            this.dialogVisible = false;
        },
        goBackHis(){
            this.$router.go(-1);
        },
        openSkillDetail(info) {
            this.dialogVisible = true
            this.skillDetail = info
        }
    },
}
</script>

<style lang="less">
@import './css/CharDetail.less';
</style>
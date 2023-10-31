<template>
    <div id="EquipInfo">
        <div class="equipInfo_header">
            <button class="close_btn" v-on:click="goBack"></button>
        </div>
        <div class="equipInfo_body">
            <div class="detail_wrap flex_wrap">
                <div class="info_box"> 
                    <p class="grade">LV.{{infoData.grade}}</p>
                    <img v-bind:src="infoData.img"/>
                </div>
                <div class="desc_box flex_one">
                    <div class="battle_wrap flex_wrap">
                        <h3>{{infoData.title}}</h3>
                        <div class="zl_wrap pos_rea">
                            <i class="zl_icon icon pos_abs"></i>
                            <p class="txt">{{infoData.current_zl}}</p>
                        </div>            
                    </div>
                    <p class="desc_txt">{{infoData.info}}</p>
                </div>
            </div>
        </div>
        <div class="equipInfo_footer">
             <PageBottom/>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
export default {
    name:"EquipInfo",
    data() {
        return {
            infoData:this.$route.query.info
        }
    },
    components:{
        PageBottom
    },    
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="less">
@import './css/EquipInfo.less';
</style>
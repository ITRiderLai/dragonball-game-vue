<template>
    <div id="GamerData">
        <div class="grade_wrap">
            <div class="grade flex_wrap">
                <div class="text_wrap pos_rea">
                    <div class="grade_txt">
                        <span>{{gradeText}}</span>
                    </div>
                    <div class="exp_wrap">
                        <span class="name">{{nameText}}</span>
                        <div class="exp_limit">
                            <p class="exp_txt">{{expText + '/' + maxExpText}}</p>
                            <div class="exp_current" v-bind:style="{width:expBarWidth + '%'}"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="coin_wrap">
                <div class="coin">
                    <i class="icon coin_icon"></i>
                    <span>{{coinText}}</span>
                </div>
                <div class="coin">
                    <i class="icon dia_icon"></i>
                    <span>{{diaText}}</span>
                </div>
            </div>
            <VigorSp class="vigor"></VigorSp>
        </div>
        <Battle></Battle>
    </div>
</template>

<script>
import VigorSp from '../components/VigorSp';
import Battle from '../components/Battle';
import {mapGetters} from 'vuex';
export default {
    name:'GamerData',
    components:{
        VigorSp,
        Battle
    },
    data() {
        return {
        }
    },
    computed:{
        nameText(){
            return this.$store.state.gamerData.name;
        },
        gradeText(){
            return this.$store.state.gamerData.grade;
        },
        expText(){
             return this.$store.state.gamerData.expCount;
        },
        maxExpText(){
             return this.$store.state.gamerData.maxExpCount;
        },
        ...mapGetters('gamerData', [
            'diaText',
            'coinText',
            'expBarWidth'
        ])
    }
}
</script>

<style lang="less">
@import '../css/GamerData.less';
</style>
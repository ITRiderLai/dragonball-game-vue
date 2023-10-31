<template>
    <div id="VigorSp">
        <div class="container pos_rea">
            <i class="vigor_icon icon pos_abs"></i>
            <div class="empty_bar pos_rea">
                <div class="vigor_current current_bar pos_abs" v-bind:style="{width: vigorBarWidth + '%'}"></div>
                <span class="txt pos_abs">{{vigorCount + '/' + maxVigorCount}}</span>
            </div>
        </div>
        <div class="container pos_rea">
            <i class="sp_icon icon pos_abs"></i>
            <div class="empty_bar pos_rea">
                <div class="sp_current current_bar pos_abs" v-bind:style="{width: spBarWidth + '%'}"></div>
                <span class="txt pos_abs">{{spCount}}/10</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name:"VigorSp",
    data() {
        return {
            
        }
    },
    computed:{
        ...mapState('gamerData', ['spCount', 'vigorCount', 'maxVigorCount']),
        ...mapState('gamerData', {
            vigorBarWidth: state => state.vigorCount / state.maxVigorCount * 100,
            spBarWidth: state => state.spCount / 10 * 100
        })
    }
}
</script>

<style lang="less">
@import '../css/VigorSp.less';
</style>
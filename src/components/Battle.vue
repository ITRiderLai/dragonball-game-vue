<template>
    <div id='Battle'>
        <ul class="bat_list" >
            <li class="bat_item pos_rea">
                <i class="icon zl_icon pos_abs"></i>
                <div class="txt">{{zlCount}}</div>
            </li>
            <li class="bat_item pos_rea">
                <i class="icon merit_icon pos_abs"></i>
                <div class="txt">{{meritCount}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'Battle',
    data() {
        return {

        }
    },
    computed:{
        zlCount(){
            return this.$store.state.gamerData.zlCount;
        },
        meritCount(){
            return this.$store.state.gamerData.meritCount;
        }
    }
}
</script>

<style lang="less">
@import '../css/Battle.less';
</style>
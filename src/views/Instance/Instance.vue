<template>
    <div id='Instance'>
        <div class="instance_header">
            <GamerData></GamerData>
        </div>
        <div class="instance_body">
            <ul class="instance_list">
                <li class="instance_item float_left pos_rea" v-for="(item,index) in instance_data" :key="index" v-bind:style="item.width" v-on:click="goInstanceItem(index)">
                    <div class="pos_abs" v-show="index <= instanceLevel ? false : true"></div>
                    <img v-bind:src="item.url"/>
                </li>
            </ul>
        </div>
        <div class="instance_footer">
            <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import GamerData from '../../components/GamerData';
import {mapState,mapGetters} from 'vuex';
import InstanceData from '../../InstanceData.json';
export default {
    name:'Instance',
    components:{
        PageBottom,
        GamerData
    },
    computed:{
        ...mapState('gamerData',[
            'name',
            'spCount',
            'vigorCount',
            'maxVigorCount',
            'expCount',
            'maxExpCount',
            'grade',
            'instanceLevel'
        ]),
        ...mapGetters('gamerData', [
            'expBarWidth',
            'coinText',
            'diaText'
        ])
    },
    data() {
        return {
            instance_data:[],
        }
    },
    created() {
        this.instance_data = InstanceData.InstanceLevel;
    },
    methods: {
        goInstanceItem(index){
            if(index > this.instanceLevel){
                return;
            }
            this.$router.push({path:"/instanceItem",query:{level:index}})
        }
    },
}
</script>

<style lang="less">
@import './css/Instance.less';
</style>
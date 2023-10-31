<template>
    <div id="WarriorTab">
        <ul class="warrior_list">
            <li class="warrior_item" v-for="(item,index) in warriorArr" :key="index">
                <div class="warrior_title" v-if="item.char.length !== 0">
                    <div class="start_wrap">
                        <i class="start_icon" v-for="(start, index) in item.num" :key="index"></i>
                    </div>
                    <div class="select_all">
                        <label class="select_txt">Select All</label>
                        <input class="select_radio" type="checkbox"/>
                    </div>
                </div>
                <ul class="char_list">
                    <li class="char_item" v-for="(char, index) in item.char" :key="index" v-on:click="handleSelected(char.id)">
                        <div class="char_wrap pos_rea">
                            <i class="select_icon pos_abs" v-if="selectedId.includes(char.id)"></i>
                            <img class="char_img" v-bind:src="char.headImg">
                            <span class="char_lv">{{char.grade}}</span>
                        </div>
                        <div class="char_name">
                            <p>
                                <span>{{char.title}}</span>
                            </p>
                        </div>
                    </li>
                </ul>             
            </li>
        </ul>
        <div :class="['sell_wrap flex_wrap', {'use_active': selectedId.length}]">
            <div class="sell_desc">
                <p class="char_total">已选：{{selectedId.length}}/500</p>
                <p class="desc">出售获得</p>
            </div>
            <div class="sell_coin">
                <i class="coin"></i>
                <span>{{receiveCoin}}</span>
            </div>
            <div class="sell_btn">
                <button class="btn sell" v-on:click="handleSell" v-bind:disabled="!selectedId.length ? 'disabled' : null">Sell in Batch</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import charData from '../charData.json';

export default {
    name:"WarriorTab",
    props:[
        'warriorData'
    ],
    data() {
        return {
            selectedId:[]
        }
    },
    computed:{
        warriorArr(){
            let charArr = [];
            let charCategoy = [];
            this.warriorData.forEach((item)=>{
                let value = charData.find((param)=>{
                    return item.char_name == param.name;
                })
                let obj = Object.assign({},value,item);
                charArr.push(obj)
            });
            charArr.forEach(item=>{
                if(charCategoy.length != 0){
                    let isStar = charCategoy.some(param=>{
                        return param.num == item.star;
                    });
                    if(isStar == false){
                        let obj = {
                            id:item.star,
                            num:item.star,
                            char:[item]
                        };
                        charCategoy.push(obj);
                    }else{
                        let charIndex = charCategoy.findIndex(param=>param.num == item.star);
                        charCategoy[charIndex].char.push(item);   
                    }
                }else{
                    let obj = {
                        id:item.star,
                        num:item.star,
                        char:[item]
                    };
                    charCategoy.push(obj);
                }
            })
            charCategoy.sort((n1,n2)=>{
                return n1.id - n2.id;
            });
            return charCategoy;
        },
        //选中出售人物的总价
        receiveCoin(){
            return this.selectedId.length * 400;
        }
    },
    methods: {
        ...mapMutations('gamerData',[
            'increCoinCount'
        ]),
        handleSelected(id){
            //人物是否已经选择
            if(this.selectedId.includes(id)){
                //如果已经选择了再点击取消选择
                this.selectedId.splice(this.selectedId.indexOf(id),1);
                
            }else{
                //如果没有选择放入数组
                this.selectedId.push(id);
            }
        },
        //物品系统出售
        handleSell(){
            this.$emit('on-sell')
            this.reset()
        },
        //重置数据
        reset() {
            this.selectedId = []
        }
    },

}
</script>

<style lang="less">
@import '../css/WarriorTab.less';
</style>
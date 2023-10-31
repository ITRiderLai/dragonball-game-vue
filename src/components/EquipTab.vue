<template>
    <div id="EquipTab">
        <ul class="equip_list">
            <li class="equip_item" v-for="(item,index) in equipArr" :key="index">
                <div class="equip_title" v-if="item.equip.length !== 0">
                    <div class="start_wrap">
                        <i class="start_icon" v-for="(start, index) in item.num" :key="index"></i>
                    </div>
                    <div class="select_all">
                        <label class="select_txt">Select All</label>
                        <input class="select_radio" type="checkbox"/>
                    </div>
                </div>
                <ul class="zb_list">
                    <li class="zb_item" v-for="(eq, index) in item.equip" :key="index" v-on:click="handleSelected(eq.id)">
                        <div class="zb_wrap pos_rea">
                            <i class="select_icon pos_abs" v-if="selectedId.includes(eq.id)"></i>
                            <img class="zb_img" v-bind:src="eq.Img || eq.img">
                            <span class="zb_lv">{{eq.grade}}</span>
                        </div>
                        <div class="zb_name">
                            <p>
                                <span>{{eq.title}}</span>
                            </p>
                        </div>
                    </li>
                </ul>             
            </li>
        </ul>
        <div :class="['sell_wrap flex_wrap', {'use_active': selectedId.length}]">
            <div class="sell_desc">
                <p class="zb_total">已选：{{selectedId.length}}/500</p>
                <p class="desc">出售获得</p>
            </div>
            <div class="sell_coin">
                <i class="coin"></i>
                <span>{{receiveCoin}}</span>
            </div>
            <div class="sell_btn">
                <button class="btn sell" @click="handleSell" v-bind:disabled="!selectedId.length ? 'disabled' : null">Sell in Batch</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"EquipTab",
    props:[
        'equipData'
    ],
    data() {
        return {
           selectedId:[]
        }
    },
    computed:{
        equipArr(){
            let equipCategoy = [];
            this.equipData.forEach(item=>{
                if(equipCategoy.length != 0){
                    let isStar = equipCategoy.some(param=>{
                        return param.num == item.star;
                    });
                    if(isStar == false){
                        let obj = {
                            id:item.star,
                            num:item.star,
                            equip:[item]
                        };
                        equipCategoy.push(obj);
                    }else{
                        let charIndex = equipCategoy.findIndex(param=>param.num == item.star);
                        equipCategoy[charIndex].equip.push(item);   
                    }
                }else{
                    let obj = {
                        id:item.star,
                        num:item.star,
                        equip:[item]
                    };
                    equipCategoy.push(obj);
                }
            })
            equipCategoy.sort((n1,n2)=>{
                return n1.id - n2.id;
            });
            return equipCategoy;
        },        
        //选中出售人物的总价
        receiveCoin(){
            return this.selectedId.length * 400;
        }
    },
    methods: {
        handleSelected(id){
            //是否已经选择
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
        }
    },

}
</script>

<style lang="less">
@import '../css/EquipTab.less';
</style>
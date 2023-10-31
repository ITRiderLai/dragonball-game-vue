<template>
    <div id="Enhance">
        <div class="enhance_header">
            <button class="close_btn" v-on:click="goBack"></button>
        </div>
        <div class="enhance_body">
            <ul class="enhance_list">
                <li class="enhance_item" v-for="(item,index) in listData" :key="index">
                    <div class="enhance_title" v-if="item.content.length !== 0">
                        <div class="start_wrap">
                            <i class="start_icon" v-for="(start, index) in item.num" :key="index"></i>
                        </div>
                    </div>
                    <ul class="data_list">
                        <li class="data_item" v-for="(param, index) in item.content" :key="index" v-on:click="handleSelected(param.id)">
                            <div class="data_wrap pos_rea">
                                <i class="select_icon pos_abs" v-if="selectedId.includes(param.id)"></i>
                                <img class="data_img" v-bind:src="param.headImg || param.img">
                                <span class="data_lv">{{param.grade}}</span>
                            </div>
                            <div class="data_name">
                                <p>
                                    <span>{{param.title}}</span>
                                </p>
                            </div>
                        </li>
                    </ul>             
                </li>
            </ul>
            <div class="control_wrap">
                <button class="replace_btn" v-on:click="handleEnhance" v-bind:disabled="selectedId.length == 0 ? 'disabled' : null" v-bind:style="{opacity:selectedId.length == 0 ? '0.5' : '1'}">升级</button>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="enhance_footer">
             <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import charData from '../../charData.json';
import {mapGetters,mapActions} from 'vuex';
export default {
    name:"Enhance",
    components:{
        PageBottom
    },
    data() {
        return {
            loadingVisible:false,
            listData:[],
            selectedId:[]
        }
    },
    computed:{
        ...mapGetters('gamerChar',[
            'charList'
        ]),
        posIndex(){
            return this.$route.query.id
        }
    },
    created() {
        let url = "";
        let cate = this.$route.query.cate;
        switch(cate){
            case 'warrior':
                url="/index.php/index/ball/getWarrior"
                break;
            case 'equip':
                url="/index.php/index/ball/getEquip"
                break;
        }
        this.loadingVisible = true;
        this.axios({
            method:'post',
            url:url
        }).then(res=>{
            this.loadingVisible = false;
            let arr = [];
            let category = [];
            //武器
            if(cate == 'equip'){
                res.data.forEach(item=>{
                    if(item.is_equip == 0){
                        return;
                    }
                    if(category.length != 0){
                        let isStar = category.some(param=>{
                            return param.num == item.star;
                        });
                        if(isStar == false){
                            let obj = {
                                id:item.star,
                                num:item.star,
                                content:[item]
                            };
                            category.push(obj);
                        }else{
                            let charIndex = category.findIndex(param=>param.num == item.star);
                            category[charIndex].content.push(item);   
                        }
                    }else{
                        let obj = {
                            id:item.star,
                            num:item.star,
                            content:[item]
                        };
                        category.push(obj);
                    }
                })
                category.sort((n1,n2)=>{
                    return n1.id - n2.id;
                });
                
                this.listData = category;
            }

            res.data.forEach((item)=>{
                if(item.fight == 0){
                    return;
                }
                let value = charData.find((param)=>{
                    return item.char_name == param.name;
                })
                let obj = Object.assign({},value,item);
                arr.push(obj)
            });
            arr.forEach(item=>{
                if(category.length != 0){
                    let isStar = category.some(param=>{
                        return param.num == item.star;
                    });
                    if(isStar == false){
                        let obj = {
                            id:item.star,
                            num:item.star,
                            content:[item]
                        };
                        category.push(obj);
                    }else{
                        let charIndex = category.findIndex(param=>param.num == item.star);
                        category[charIndex].content.push(item);   
                    }
                }else{
                    let obj = {
                        id:item.star,
                        num:item.star,
                        content:[item]
                    };
                    category.push(obj);
                }
            })
            category.sort((n1,n2)=>{
                return n1.id - n2.id;
            });
            this.listData = category;
        })
    },
    methods:{
        ...mapActions('gamerChar',[
            'upDateCharData',
            'deleteChar',
            'upDataEquip',
            'deleteEquip'
        ]),
        goBack(){
            this.$router.go(-1);
        },
        handleEnhance(){
            this.loadingVisible = true;
            let cate = this.$route.query.cate;
            let char = this.charList[this.posIndex];
            this.axios({
                method:'post',
                url:'/index.php/index/ball/enhance',
                data:{
                    selectedId:this.selectedId,
                    category:cate,
                    char:char
                }
            }).then(res=>{
                this.deleteChar(this.posIndex);
                let char = charData.find(item=>item.name == res.data.charData.char_name);
                let charObj = {char:Object.assign({},char,res.data.charData),index:this.posIndex};
                this.upDateCharData(charObj);
                this.loadingVisible = false;
                this.$router.push({path:'/form',query:{id:this.posIndex}});
            })
        },
        handleSelected(val){
            
            let includes = this.selectedId.includes(val);
            if(includes){
                let index = this.selectedId.findIndex(item=>item == val);
                this.selectedId.splice(index,1);
            }else{
                this.selectedId.push(val);
            }
        }
    }
}
</script>

<style lang="less">
@import './css/Enhance.less';
</style>
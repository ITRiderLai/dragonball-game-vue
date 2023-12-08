<template>
    <div id="Replace">
        <div class="replace_header">
            <button class="close_btn" v-on:click="goBack"></button>
        </div>
        <div class="replace_body">
            <ul class="replace_list">
                <li class="replace_item" v-for="(item,index) in itemData" :key="index">
                    <div class="replace_title" v-if="item.content.length !== 0">
                        <div class="start_wrap">
                            <i class="start_icon" v-for="(start, index) in item.num" :key="index"></i>
                        </div>
                    </div>
                    <ul class="data_list">
                        <li class="data_item" v-for="(param, index) in item.content" :key="index" v-on:click="handleSelected(param.id)">
                            <div class="data_wrap pos_rea">
                                <i class="select_icon pos_abs" v-if="selectedId == param.id ? true : false"></i>
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
                <button class="replace_btn" v-on:click="handleReplace" v-bind:disabled="selectedId == '' ? 'disabled' : null" v-bind:style="{opacity:selectedId == '' ? '0.5' : '1'}">替换</button>
            </div>
        </div>
        <div class="loading_wrap" v-show="loadingVisible">
            <img class="loading" src="/image/loading.png"/>
        </div>
        <div class="replace_footer">
             <PageBottom></PageBottom>
        </div>
    </div>
</template>

<script>
import PageBottom from '../../components/PageBottom';
import charData from '../../charData.json';
import {mapGetters,mapActions,mapMutations} from 'vuex';
export default {
    name:"Replace",
    components:{
        PageBottom
    },
    data() {
        return {
            itemData:[],
            selectedId:"",
            loadingVisible:false
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
        this.loadingVisible = true;
        let cate = this.$route.query.cate;
        let url = "";
        switch(cate){
            case 'warrior':
                url="/index.php/index/ball/getWarrior";
                break;
            case 'equip':
                url="/index.php/index/ball/getEquip"
                break;
        }
        this.axios({
            method:"post",
            url:url
        }).then(res=>{
            this.loadingVisible = false;
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
                return n2.id - n1.id;
            });
             this.itemData = category;
              return;
            }

            //人物
            let arr = [];
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
                return n2.id - n1.id;
            });
            this.itemData = category;
        })
    },
    methods: {
        ...mapActions('gamerChar',[
            'initCharData',
            'upDateCharData',
            'deleteChar',
            'upDataEquip',
            'deleteEquip'
        ]),
        ...mapMutations('gamerData', [
            'initCurrentZl'
        ]),
        goBack(){
            this.$router.go(-1);
        },
        handleSelected(id){
            //是否已经选择
            if(this.selectedId == id){
                //如果已经选择了再点击取消选择
                this.selectedId = "";
                
            }else{
                this.selectedId = id
            }
        },
        handleReplace(){
            this.loadingVisible = true;
            let cate = this.$route.query.cate;
            let url = "";
            let posid = "";
            switch(cate){
                case 'warrior':
                    url="/index.php/index/ball/replaceChar";
                    posid = this.posIndex;
                    break;
                case 'equip':
                    url="/index.php/index/ball/replaceEquip"
                    posid = this.charList[this.posIndex].id;
                    break;
            }
            this.axios({
                method:'post',
                url:url,
                data:{
                    id:this.selectedId,
                    pos:posid
                }
            }).then((res)=>{
                this.loadingVisible = false;
                console.log(res);
                if(cate == 'equip'){
                    let obj = {charId:this.posIndex,equipId:this.selectedId,equip:res.data.equip}
                    if(this.charList[this.posIndex].equip_id != null){
                        this.deleteEquip(this.posIndex);
                    }
                    this.upDataEquip(obj);
                    this.$router.push({path:'/form',query:{id:this.posIndex}});
                    return;
                }
                if(this.charList.length > this.posIndex){
                    this.deleteChar(this.posIndex);
                }
                
                const charList = [];
                let curZl = 0;
                res.data.charList.forEach(item => {
                    curZl += item.current_zl
                    let charInfo = charData.find(itm=>itm.name == item.char_name);
                    charList.push(Object.assign({}, charInfo, item))
                })
                
                this.initCurrentZl(curZl)
                this.initCharData(charList);
                this.$router.push({path:'/form',query:{id:this.posIndex}});
            })
        }
    },
}
</script>

<style lang="less">
@import './css/Replace.less';
</style>
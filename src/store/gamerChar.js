
import Vue from 'vue'
const gamerChar = {
    namespaced: true,
    state:{
        charData:[]
    },
    mutations:{
        initCharData(state,n){
            state.charData = n;
        },
        upDateCharData(state,data){
            state.charData.splice(data.index,0,data.char);

        },
        deleteChar(state,data){
            state.charData.splice(data,1);
        },
        adjustChar(state,data){
            state.charData.forEach((item,index)=>{
                if(item.fight_pos == data.index){
                    let obj = Object.assign({},item,{fight_pos:data.currentIndex});
                    Vue.set(state.charData,index,obj);
                }else if(item.fight_pos == data.currentIndex){
                    let obj = Object.assign({},item,{fight_pos:data.index});
                    Vue.set(state.charData,index,obj);
                }
            })
        },
        upDataEquip(state,data){
            let obj = Object.assign({},state.charData[data.charId],{equip_id:data.equipId});
            obj.current_zl = obj.current_zl + data.equip.current_zl;
            Vue.set(state.charData,data.charId,obj);
            state.charData[data.charId] = Object.assign({},state.charData[data.charId],{equip:data.equip}); 
        },
        deleteEquip(state,data){
            let obj = state.charData.find(item=>item.fight_pos == data);
            let index = state.charData.findIndex(item=>item.fight_pos == data);
            obj.current_zl = obj.current_zl - obj.equip.current_zl;
            obj.equip_id = null;
            delete obj.equip;
            Vue.set(state.charData,index,obj);
        }
    },
    getters:{
        charList(state){
            return state.charData.sort((n1,n2)=>{
                return n1.fight_pos - n2.fight_pos;
            });
        }
    },
    actions:{
        initCharData({commit}, data) {
            commit('initCharData',data);
        },
        upDateCharData({commit},data){
            commit('upDateCharData',data);
            commit('gamerData/increCurrentZl',data.char.current_zl,{root:true});      
        },
        deleteChar({commit,getters},data){
            let char = getters.charList[data];
            commit('gamerData/increCurrentZl',-char.current_zl,{root:true});
            commit('deleteChar',data);   
        },
        adjustChar({commit},data){
           commit('adjustChar',data);
        },
        upDataEquip({commit},data){
            commit('upDataEquip',data);
            commit('gamerData/increCurrentZl',data.equip.current_zl,{root:true});
        },
        deleteEquip({commit,getters},data){
            let char = getters.charList[data];
            commit('gamerData/increCurrentZl',-char.equip.current_zl,{root:true});
            commit('deleteEquip',data);
        }
    }
}

export default gamerChar;
const gamerData = {
    namespaced: true,
    state:{
        //SP体力值
        spCount : 0,
        //vigor活力值
        vigorCount:0,
        //vigor最大值
        maxVigorCount:0,
        expCount:0,
        maxExpCount:0,
        coinCount:0,
        diaCount:0,
        grade:0,
        name:"",
        zlCount:0,
        meritCount:0,
        rank:0,
        instanceLevel:0,
        chapterId:"",
    },
    getters:{
        expBarWidth(state){
            return state.expCount / state.maxExpCount * 100;
        },
        //金币科协计数法
        coinText(state){
            let coin = state.coinCount;
            if(coin > 99999){
                coin = Math.round(coin / 1000) + 'k';
            }
            return coin; 
        },
        //钻石科学计数法
        diaText(state){
            let dia = state.diaCount;
            if(dia > 99999){
                dia = Math.round(dia / 1000) + 'k';
            }
            return dia;  
        }
    },
    mutations:{
        initGamerData(state,data){
            state.name = data.name;
            state.spCount = data.current_sp;
            state.vigorCount = data.current_vigor;
            state.maxVigorCount = data.max_vigor;
            state.expCount = data.current_exp;
            state.maxExpCount = data.max_exp;
            state.coinCount = data.coin;
            state.diaCount = data.diamond;
            state.grade = data.grade;
            state.zlCount = data.current_zl;
            state.meritCount = data.merit;
            state.rank = data.rank;
            state.instanceLevel = data.instance_level;
            state.chapterId = data.chapter_id;
        },
        initName(state,n){
            state.name = n;
        },
        initCurrentZl(state, n) {
            state.zlCount = n;
        },
        increGrade(state,n){
            state.grade += n;
        },
        //增加SP值
        increSpCount(state,n){
            state.spCount += n;
        },
        //增加Vigor值
        increVigorCount(state,n){
            state.vigorCount += n;
        },
        //增加Vigor最大值
        increMaxVigorCount(state,n){
            state.maxVigorCount += n;
        },
        //增加exp值
        increExpCount(state,n){
            state.expCount += n;
        },
        //增加exp最大值
        increMaxExpCount(state,n){
            state.maxExpCount += n;
        },
        //增加金币
        increCoinCount(state,n){
            state.coinCount += n;
        },
        //增加钻石
        increDiaCount(state,n){
            state.diaCount += n;
        },
        //增加排名
        increRank(state,n){
            state.rank += n;
        },
        //战力
        increCurrentZl(state,n){
            state.zlCount += n;
        }
    }
}

export default gamerData;
import Vue from 'vue'
import Vuex from 'vuex'
import gamerData from './gamerData.js';
import gamerChar from './gamerChar.js';
Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        gamerData:gamerData,
        gamerChar:gamerChar
    }
})
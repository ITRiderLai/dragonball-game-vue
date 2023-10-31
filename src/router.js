import Vue from 'vue'
import VueRouter from 'vue-router'
import StartIndex from './views/StartIndex/StartIndex'
import ForgetPwd from './views/ForgetPwd/ForgetPwd'
import Home from './views/Home/Home'
import Form from './views/Form/Form'
import CharDetail from './views/CharDetail/CharDetail'
import Bar from './views/Bar/Bar'
import House from './views/House/House'
import Instance from './views/Instance/Instance'
import Shop from './views/Shop/Shop'
import InstanceItem from './views/InstanceItem/InstanceItem'
import Adventure from './views/Adventure/Adventure'
import Event from './views/Event/Event'
import Adjust from './views/Adjust/Adjust'
import Replace from './views/Replace/Replace'
import EquipInfo from './views/EquipInfo/EquipInfo'
import Enhance from './views/Enhance/Enhance'
import War from './views/War/War'
Vue.use(VueRouter)

const routes = [
  {path: '/',name: 'StartIndex',component: StartIndex},
  {path:'/forget',name:'ForgetPwd',component:ForgetPwd},
  {path:'/home',name:'Home',component:Home},
  {path:'/form',name:'Form',component:Form},
  {path:'/charDetail',name:'CharDetail',component:CharDetail},
  {path:'/bar',name:'Bar',component:Bar},
  {path:'/house',name:'House',component:House},
  {path:'/instance',name:'Instance',component:Instance},
  {path:'/shop',name:'Shop',component:Shop},
  {path:'/instanceItem',name:'InstanceItem',component:InstanceItem},
  {path:'/adventure',name:'Adventure',component:Adventure},
  {path:'/event',name:'Event',component:Event},
  {path:'/adjust',name:'Adjust',component:Adjust},
  {path:'/replace',name:'Replace',component:Replace},
  {path:'/equipInfo',name:'EquipInfo',component:EquipInfo},
  {path:'/enhance',name:'Enhance',component:Enhance},
  {path:'/war',name:'War',component:War},
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

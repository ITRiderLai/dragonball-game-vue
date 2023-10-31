<template>
  <div id="app">
   <router-view />
   <el-dialog
   custom-class="dialog_play"
   title="温馨提示"
   :visible.sync="dialogVisible"
   width="70%"
   :before-close="handleClose"
   center>
      <button v-on:click="handlePlayAudio" class="play_btn">点击播放</button>
      <p>当前浏览器不支持自动播放声音</p>
      <p>点击按钮播放</p>
   </el-dialog>
   <!-- <audio src="/audio/music.mp3" ref="audio" autoplay="autoplay" hidden="true" loop></audio> -->
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex';
export default {
  name: 'App',
  data() {
    return {
      dialogVisible: false,
    }
  },
  computed:{
    ...mapState('gamerData',[
      'vigorCount',
      'maxVigorCount'
    ]),

  },
  created() {
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
         sessionStorage.removeItem("store");
    } 
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
    if(this.$utils.getCookie('token')){
      this.getVigor();
    }
  },
  methods: {
    ...mapMutations('gamerData',[
      'increVigorCount',
      'increTenMin'
    ]),
    handleClose(done) {
      done();
    },
    handlePlayAudio(){
      // this.$refs.audio.play();
      // this.dialogVisible = false;
    },
    getVigor(){
      if(this.vigorCount == this.maxVigorCount){
        return;
      }
      setInterval(()=>{
        this.axios({
          method:'post',
          url:'/index.php/index/ball/getVigor'
        }).then(res=>{
          this.increVigorCount(res.data);
        })
      }, 600000);
    }
  },
  mounted() {
    // let promise = this.$refs.audio.play();
    // if(promise !== "undefined"){
    //   promise.then(()=>{
        
    //   }).catch(()=>{
    //     this.dialogVisible = true;
    //   })
    // }

    // this.axios({
    //     method:'get',
    //     url:'/cats'
    // }).then((res) => {
    //     console.log(res)
    // })
  },
}
</script>

<style lang="less">
@import './css/app.less';
@import './css/mixin';
.loading_wrap{
    .csz();
    width: 15rem;
    height: 15rem;
    .loading{
        width: 100%;
    }
}
</style>

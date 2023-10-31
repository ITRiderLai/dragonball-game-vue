<template>
  <div class="start_index">
      <button class="play_btn" v-on:click="dialogVisible = true"></button>
      <div class="loading_wrap" v-show="loadingVisible">
          <img class="loading" src="/image/loading.png"/>
          <p style="color: #fff; margin-top: -50px; text-align: center;">{{progressNum}}</p>
      </div>
      <el-dialog
        custom-class="login-dialog"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
        center>
        <!-- title -->
        <span slot="title" class="el-dialog__title">
          {{loginRegBodyVisible === true ? "游戏登录" : "游戏注册"}}
        </span>  
        <!-- 账号登录 -->
        <div class="dialog_body" v-show = "loginRegBodyVisible">
          <el-input placeholder="请输入账号" v-model="accountValue">
            <template slot="prepend">账号</template>
          </el-input>
          <el-input show-password placeholder="请输入密码" v-model="pwdValue">
            <template slot="prepend">密码</template>
          </el-input>
        </div>
        <!-- 快速注册 -->
        <div class="dialog_body" v-show = "!loginRegBodyVisible">
          <el-input placeholder="请输入手机号" v-model="regAccountValue">
            <template slot="prepend">手机号</template>
          </el-input>
          <el-input show-password placeholder="请输入密码" v-model="regPwdValue">
            <template slot="prepend">密码</template>
          </el-input>
          <el-input placeholder="请输入验证码" v-model="regCodeValue" maxlength="4">
             <el-button slot="append" v-on:click="sendCode" v-bind:disabled="isCodeWaiting">{{isCodeWaiting ? codeTime : "发送验证码" }}</el-button>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="login_btn" @click="handleLogin" v-show="loginRegBodyVisible">登录</el-button>
          <el-button type="primary" class="login_btn" @click="handleReg" v-show="!loginRegBodyVisible">马上注册</el-button>
          <div class="reg_forget">
            <span v-on:click="handleSwitchLoginReg">{{loginRegBtnText}}</span>
            <router-link to="/forget"><span>忘记密码</span></router-link>
          </div>
        </span>
      </el-dialog>
  </div>
  
</template>

<script>
import { resourcesPath } from '@/common/const.js';

export default {
  name: 'StartIndex',
  data() {
    return {
      dialogVisible: false,
      loadingVisible:false,
      loginRegBodyVisible:true,
      loginRegBtnText:"快速注册",
      accountValue:"",
      pwdValue:"",
      regAccountValue:"",
      regCodeValue:"",
      regPwdValue:"",
      isCodeWaiting:false,
      codeTime:59,
      progressNum: ''
    };
  },
  created() {
    //如果登录了直接跳转到游戏首页
    if(this.$utils.getCookie('token')){
      this.$router.push({path:"/home"});
    }
  },
  methods: {
    handleClose(done) {
      done();
    },
    handleSwitchLoginReg(){
      if(this.loginRegBodyVisible){
        this.loginRegBodyVisible = false;
        this.loginRegBtnText = "账号登录"
       
      }else{
        this.loginRegBodyVisible = true;
        this.loginRegBtnText = "快速注册"
      }
    },
    //验证码发送
    sendCode(){
      let code = "";
      let message;
      let type = "success";
      for(let i=0;i<4;i++){
        code += Math.floor((Math.random()*10));
      }
      sessionStorage.code = code;
      this.isCodeWaiting = true;
      //设置验证码时间倒数
      let timer = setInterval(()=>{
        if(this.codeTime === 1){
          this.isCodeWaiting = false;
          clearInterval(timer);
          this.codeTime = 59;
        }else{
          this.codeTime -= 1;
        }
      },1000);
      if(sessionStorage.code) {
         message = "您的验证码为:" + sessionStorage.code;
      }else{
        message = "验证码失效,请重新发送验证码";
        type = "error";
      }
      this.$message({
          message:message,
          type:type
      })
    },
    handleLogin(){
      this.loadingVisible = true;
      let that = this;
      let testBoolen = this.$utils.handleTestAccount(this.accountValue,this.$message,this.pwdValue);
      if(testBoolen === true){
        return
      }
      //登录输入
      this.axios({
        method:'post',
        url:'/index.php/index/ball/login',
        data:{
          account:this.accountValue,
          pwd:this.pwdValue
        }
      }).then(function(res){
        if(res.data.status === 200){
          that.$utils.setCookie('token',res.data.token,1);
          that.handlePreload();
        }
        that.$message({
          message:res.data.msg,
          type:'success'
        })
      })
    },
    handleReg(){
      //信息过滤
      this.loadingVisible = true;
      let that = this;
      let testBoolen = this.$utils.handleTestAccount(this.regAccountValue,this.$message,this.regPwdValue,this.regCodeValue);
      if(testBoolen === true){
        return
      }
      // 注册输入
      if(this.regCodeValue == sessionStorage.code){
        this.axios({
          method:'post',
          url:'/index.php/index/ball/reg',
          data:{
            regAccount:this.regAccountValue,
            regPwd:this.regPwdValue
          }
        }).then(function(res){
          //注册成功
          that.loadingVisible = false;
          if(res.data.status == 200){
              that.loginRegBodyVisible = true;
          }
          that.$message({
            message:res.data.msg,
            type:'success'
          })
        })
      }
    },
    handlePreload () {
      // eslint-disable-next-line no-undef
      let queue = new createjs.LoadQueue(true);
      console.log(resourcesPath)
      queue.loadManifest(resourcesPath);

      const handleProgress = () => {
        this.progressNum = `${Math.floor(queue.progress * 100)}%`;
        
      }

      // 加载完成回调函数
      const handleComplete = () => {
        this.progressNum = '加载完成';
        setTimeout(() => {this.loadingVisible = false;this.$router.push({path:"/home"});}, 1000)
        
      }

      // 加载进度条，监听文件的加载在全部文件中的占比，并回调 handleProgress 函数。
      queue.on('progress', handleProgress);
      // 加载完成时，监听全部文件加载完成的那一刻，并回调 handleComplete 函数。
      queue.on('complete', handleComplete);
    }
  }
}
</script>

<style lang="less">
button{
    border:none;
    outline:none;
}
.start_index{
  position:relative;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  background:url("/image/start_pic.jpg") no-repeat;
  background-size:cover;
  .play_btn{
    position:absolute;
    left:50%;
    bottom:10%;
    transform:translateX(-50%);
    width:6rem;
    height:2rem;
    background:url("/image/play_btn.png") no-repeat;
    background-size:cover;
  }
  .login-dialog{
    .el-dialog__header{
      border-bottom:1px solid #f2f2f2;
      .el-dialog__title{
        font-size:16px;
      }
      .el-dialog__headerbtn{
        top: 26px;
      }
    }
    .el-dialog__body{
      padding:25px 25px 0 25px;
      .el-input{
        margin-bottom:25px;
      }
    }
    .el-dialog__footer{
      padding:0 20px 20px 20px;
      .dialog-footer{
        .login_btn{
          width:100%;
          margin-left:0;
        }
        .reg_forget{
          margin-top:10px;
          font-size:14px;
          color:#a8a8a8;
          a{
            color:#a8a8a8;
            text-decoration:none;
          }
          span{
            padding:0 1rem;
          }
        }
      }
    }
  }
}
.loading_wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15rem;
    height: 15rem;
    transform: translate(-50%,-50%);
    z-index:9999;
    .loading{
        width: 100%;
    }
}
</style>

<template>
  <div class="start_index">
      <button class="play_btn" v-on:click="dialogVisible = true"></button>
      <div class="loading_wrap" v-show="loadingVisible">
          <img class="loading" src="/image/loading.png"/>
      </div>
      <el-dialog
        title="密码修改"
        custom-class="login-dialog"
        :visible.sync="dialogVisible"
        :show-close ="false"
        width="80%"
        center>
        <!-- title -->
        <div slot="title" class="el-dialog__title">
            <i class="el-icon-arrow-left his_back" v-on:click="handleHistoryBack"></i>
            <span>修改密码</span>
        </div>  
        <!-- 忘记密码 -->
        <div class="dialog_body" >
          <el-input placeholder="请输入手机号" v-model="accountValue">
            <template slot="prepend">手机号</template>
          </el-input>
          <el-input show-password placeholder="请输入新密码" v-model="pwdValue">
            <template slot="prepend">新密码</template>
          </el-input>
          <el-input placeholder="请输入验证码" v-model="codeValue" maxlength="4">
             <el-button slot="append" @click="sendCode"  v-bind:disabled="isCodeWaiting">{{isCodeWaiting ? codeTime : "发送验证码" }}</el-button>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="revise_btn" @click="handleRevise">修改密码</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
    name:'ForgetPwd',
    data() {
        return {
            dialogVisible:true,
            loadingVisible:false,
            accountValue:"",
            pwdValue:"",
            codeValue:"",
            isCodeWaiting:false,
            codeTime:59
        }
    },
    created() {
      //如果登录了直接跳转到游戏首页
      if(this.$utils.getCookie('token')){
        this.$router.push({path:"/home"});
      }
    },
    methods:{
        handleHistoryBack(){
            this.$router.go(-1);
        },
        handleRevise(){
          //信息过滤
          this.loadingVisible = true;
          let that = this;
          let testBoolen = this.$utils.handleTestAccount(this.accountValue,this.$message,this.pwdValue);
          if(testBoolen === true){
            return
          }
          //修改输入
          if(this.codeValue == sessionStorage.code){
            this.axios({
              method:'post',
              url:'/index.php/index/ball/forget',
              data:{
                account:this.accountValue,
                pwd:this.pwdValue
              }
            }).then(function(res){
              that.loadingVisible = true;
              if(res.data.status === 200){
                 that.$router.push({path:"/"});
              }
              that.$message({
                message:res.data.msg,
                type:'success'
              })
            })
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
        position:relative;
        top:0;
        left:0;
        .his_back{
            position:absolute;
            top:5px;
            left:0;
        }
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
        .revise_btn{
          width:100%;
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
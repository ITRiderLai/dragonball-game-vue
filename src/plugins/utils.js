export default {
    //账号过滤工具函数
    handleTestAccount:function(accountValue,message,pwdVal,codeVal){
        let text = "";
        //检测验证码桥段
        if(typeof codeVal !== "undefined"){
          let testCode = /^[0-9]{4}$/;
          if(!testCode.test(codeVal)){
            text = "请输入4位有效数字验证码";
          }
        }
        //检测密码桥段
        if(typeof pwdVal !== "undefined"){
          let testPwd = /^[\w_]{6,16}$/;
          if(!testPwd.test(pwdVal)){
            text = "密码包含字母、数字或下划线，长度为6~16";
          }
        }
        //检测账号桥段
        if(typeof accountValue !== "undefined"){
          let testAccount = /^[0-9]{11}$/;
          if(!testAccount.test(accountValue)){
            text = "账号错误，请重新输入";
          }
        }
        if(text !== ""){
          message({
            showClose:true,
            message:text,
            type:"error"
          });
          return true; 
        }
    },

    //设置cookie
    setCookie:function(cname,cvalue,exdays){
      let d = new Date();
      d.setTime(d.getTime()+(exdays*24*60*60*1000));
      let expires = 'expires='+d.toGMTString();
      document.cookie = cname + '=' + cvalue + ';' + expires;
    },

    //获取cookie
    getCookie:function(cname){
      let name = cname + '=';
      let ca = document.cookie.split(';');
      for(let i=0;i<ca.length;i++){
        let c = ca[i].trim();
        if(c.indexOf(name)==0){
          return c.substring(name.length,c.length);
        }
      }
      return '';
    },

    deepClone(obj){
      let objClone = Array.isArray(obj) ? []:{};
      if (obj && typeof obj === "object") {
      for( let key in obj){
          if (key in obj) {
          if (obj[key] && typeof obj[key] === "object") {
              objClone[key] = this.deepClone(obj[key])
          }else{
              objClone[key] = obj[key];
          }
          }
      }
      }
      return objClone;
    },

    //时间倒数，接收时间格式为时:分:秒，最大值为24:00:00，代表一天，每次计算完都有一个回调
    handleTimeReciprocal(time, calback) {
      // 拆分传入的时间值
      const timeSplit = time.split(":");
      // 最后一位必定是秒
      let sec = timeSplit[timeSplit.length - 1];

      let min = timeSplit.length === 2 ? timeSplit[0] : timeSplit.length === 3 ? timeSplit[1] : false

      let hour = timeSplit.length === 3 ? timeSplit[0] : false

      const timer = setInterval(() => {
        // 秒数减一
        sec =  Number(sec) - 1

        const res = []
        // 如果减到负数，那么又会从头开始
        if (sec === -1 && min) {
          sec = 59
          min = Number(min) - 1
        }
          
        if (min === -1 && hour) {
          min = 59
          hour = Number(hour) - 1
        }
        
        if (hour || hour === 0) res.push(hour < 10 ? '0' + hour : hour)

        if (min || min === 0) res.push(min < 10 ? '0' + min : min)

        if (sec || sec === 0) res.push(sec < 10 ? '0' + sec : sec)

        Number(res.join('')) === 0 && clearInterval(timer)
        // 将结果传给回调函数
        calback(res.join(':'))

      }, 1000);
    }
};
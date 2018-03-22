<template>
  <div class="login-container">
    <div class="login">
      <div class="main-login"><img src="../../assets/images/logo1.png" alt=""></div>
      <div class="login-continer">
        <div class="login-wrapper">
          <div class="login-con">
            <div class="con">
              <h1>云办公管理平台</h1>
              <h2>登录</h2>
              <div class="inp-con">
                <div class="inp-user clearfix">
                  <div class="icon-user fl"><img src="../../assets/images/icon_user.png" alt=""></div>
                  <div class="user-input fl"><input type="text" placeholder="请输入账号" v-model="loginForm.username"></div>
                </div>
                <div class="inp-user clearfix">
                  <div class="icon-user fl"><img src="../../assets/images/icon_lock.png" alt=""></div>
                  <div class="user-input fl"><input type="password" placeholder="请输入密码" v-model="loginForm.password">
                  </div>
                </div>
              </div>
              <div class="choice" flex="dir:left; main:center cross:center">
                <!--<div class="bdzh" flex="cross:center;"><img src="../../assets/images/checked.png" alt="">本地账户</div>-->
                <!--<div class="yzh" flex="cross:center;"><img src="../../assets/images/check.png" alt="">域账户</div>-->
                <el-radio v-model="loginForm.accountType" label="1">本地账户</el-radio>
                <el-radio v-model="loginForm.accountType" label="2">域账户</el-radio>
                <button class="login-btn" @click="handleLogin">登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="guide-wrapper" flex="main:center cross:center">
        <div class="guide">
          <img src="../../assets/images/01.png" alt="">
          <p>快速发布</p>
        </div>
        <div class="guide" flex="main:center">
          <img class="dian" src="../../assets/images/dian.png" alt="">
        </div>
        <div class="guide">
          <img src="../../assets/images/02.png" alt="">
          <p>可视管理</p>
        </div>
        <div class="guide" flex="main:center">
          <img class="dian" src="../../assets/images/dian.png" alt="">
        </div>
        <div class="guide">
          <img src="../../assets/images/03.png" alt="">
          <p>云端存储</p>
        </div>
        <div class="guide" flex="main:center">
          <img class="dian" src="../../assets/images/dian.png" alt="">
        </div>
        <div class="guide">
          <img src="../../assets/images/04.png" alt="">
          <p>极致体验</p>
        </div>
      </div>
      <div class="footer">
        <p>版权所有 © 2018 联想创投成员企业 叠云（北京）科技股份有限公司 保留所有权利 版本号：V1.0</p>
        <img src="../../assets/images/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { validateNORE } from '@/utils/validate'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validateNORE(value)) {
          callback(new Error('请输入正确的用户名,仅支持英文、数字、下划线'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度至少6位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: 'password',
          accountType: '1'
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false
      }
    },
    methods: {
      // showPwd() {
      //   if (this.passwordType === 'password') {
      //     this.passwordType = ''
      //   } else {
      //     this.passwordType = 'password'
      //   }
      // },
      handleLogin() {
        // this.$refs.loginForm.validate(valid => {
        //   if (valid) {
        //     this.loading = true
        this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
          this.loading = false
          this.$router.push({ path: '/' })
          window.location.reload()
        }).catch(() => {
          this.loading = false
        })
        //   } else {
        //     console.log('error submit!!')
        //     return false
        //   }
        // })
      }
    },
    created() {
    },
    destroyed() {
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "flex.css";

  .fl {
    float: left
  }

  .fr {
    float: right
  }

  .clearfix:after {
    content: "\200B";
    display: block;
    height: 0;
    clear: both;
  }

  .clearfix {
    *zoom: 1;
  }

  .login {
    position: relative;
    width: 100%;
    background: url("../../assets/images/banner.jpg") no-repeat center top;
    background-size: 100% 741px;
    min-height: 741px;
    .main-login img {
      margin: 16px 0 0 23px;
      width: 365px;
      height: 46px;
    }
    .login-continer {
      width: 1000px;
      margin: 0 auto;
      .login-wrapper {
        position: relative;
        width: 958px;
        background: url("../../assets/images/login_bg.png") no-repeat center center;
        background-size: 100% auto;
        min-height: 626px;
        overflow: hidden;
        .login-con {
          float: right;
          width: 488px;
          height: 400px;
          margin: 110px 82px 0 0;
          .con {
            width: 306px;
            margin: 0 auto;
            h1 {
              color: #8b8a8a;
              font-size: 25px;
              font-weight: normal;
            }
            h2 {
              color: #8b8a8a;
              font-size: 18px;
              font-weight: normal;
              margin-top: 100px;
            }
            .inp-user {
              width: 100%;
              height: 37px;
              background: #f2f2f2;
              margin-bottom: 15px;
              .icon-user img {
                margin: 10px 0 0 10px;
                width: 20px;
                height: 21px;
              }
              .user-input {
                width: 265px;
                height: 100%;
                input {
                  width: 100%;
                  height: 100%;
                  margin-left: 10px;
                  border: none;
                  background: transparent;
                  &:focus {
                    outline: 0;
                  }
                }
              }
            }
            .choice {
              color: #8b8a8a;
              width: 100%;
              margin-top: 20px;
              .bdzh img, .yzh img {
                width: 18px;
                height: 18px;
                margin-left: 5px;
              }
              .login-btn {
                width: 132px;
                height: 43px;
                line-height: 43px;
                background: #2795d5;
                font-size: 18px;
                color: white;
                text-align: center;
                margin-left: 10px;
                cross: pointer;
              }
            }
          }
        }
      }
    }
    .guide-wrapper {
      width: 1000px;
      margin: 0 auto;
      margin-top: 80px;
      color: #2795d5;
      .guide {
        position: relative;
        width: 10%;
        text-align: center;
      }
      img.dian {
        position: absolute;
        top: -30px;
      }
    }
    .footer {
      position: relative;
      width: 1000px;
      height: 70px;
      margin: 0 auto;
      p {
        line-height: 70px;
        text-align: center;
        font-size: 18px;
        color: #8b8a8a;
        margin-top: 90px;
      }
      img {
        position: absolute;
        top: -50px;
        right: -200px;
      }
    }
  }
</style>



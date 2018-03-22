<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="right-menu">
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <svg-icon icon-class="user"/>
            {{ name }}
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown" class="commonLoginOut">
            <el-dropdown-item>
              <span @click="ModifyPassword" style="display:block;">{{$t('navbar.resetPassword')}}</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--<div class="split fr"><span></span></div>-->
      <div class="v-email fr">
        <el-badge :value="num" :max="99" class="item">
          <el-button class="share-button" icon="el-icon-message" type="text"
                     @click="showMessage"></el-button>
        </el-badge>
      </div>
    </el-menu>
    <el-dialog
      width="500"
      title="修改密码"
      append-to-body
      custom-class="resetPasswordDialog defineDialog"
      :visible.sync="resetPasswordDialogShow">
      <el-form class="small-space" :model="resetQuery" label-position="left" :rules="rules" ref="resetPasswordForm"
               label-width="100px">
        <el-form-item label="原有密码" prop="name">
          <el-input v-model="resetQuery.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="更新密码" prop="newpwd">
          <el-input v-model="resetQuery.newpwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="r_password">
          <el-input v-model="resetQuery.r_password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button @click.native="resetF" plain>关 闭</el-button>
      </div>
    </el-dialog>
    <!--弹出-->
    <div class="message-con" v-if="show">
      <div class="message-title" flex="cross:center">
        <div class="sanj"><img src="../../../assets/images/sanj.png" alt=""></div>
        <div flex-box="1" class="mess-con">信息中心</div>
        <div flex-box="0" class="mess-dele">
          <!--<img src="../../../assets/images/dele.png" alt="">-->
          <el-button type="text" icon="el-icon-delete" @click.native="clearMessage"></el-button>
        </div>
      </div>
      <div class="message-list">
        <ul>
          <li v-for="item in MessageList">
            <p>{{item.name}}:{{ item.desc }} - {{ResultDesc[item.result]}}</p>
            <i>{{ item.time }}</i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-cond-assign,no-constant-condition */

  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import * as common from '@/api/common'
  import { validatAlphabetsAndNumber } from '@/utils/validate'

  export default {
    data() {
      const chkPass = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入登录密码'))
        } else {
          if (!validatAlphabetsAndNumber(value)) {
            callback(new Error('仅支持英文和数字'))
          } else {
            if (value.length > 20) {
              callback(new Error('密码长度不能超过20个字符'))
            }
          }
          callback()
        }
      }
      const chkPass2 = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请再次输入登录密码'))
        } else {
          if (value !== this.resetQuery.newpwd) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        }
      }
      return {
        resetQuery: {
          pwd: '',
          newpwd: '',
          r_password: ''
        },
        resetPasswordDialogShow: false,
        name: '',
        rules: {
          pwd: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass
            }
          ],
          newpwd: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass
            }
          ],
          r_password: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass2
            }
          ]
        },
        show: false,
        MessageList: [],
        ResultDesc: { 0: '失败', 1: '成功' },
        num: 0
      }
    },
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    methods: {
      getMessageList() {
        return new Promise((resolve, reject) => {
          common.getUnreadList().then(res => {
            // console.log(res.data)
            if (res.data.res === 0) {
              // console.log(res.data.res)
              this.num = res.data.num
              resolve()
            } else {
              // console.log(res.data.res)
              this.$message({
                type: 'error',
                message: '获取消息个数失败'
              })
            }
          }).catch(error => {
            reject(error)
          })
        }).then(() => {
          common.getReadList(0, this.num).then(r => {
            if (r.data.res === 0) {
              this.MessageList = r.data.content
            } else {
              this.$message({
                type: 'error',
                message: '获取消息列表失败'
              })
            }
          })
        })
      },
      clearMessage() {
        common.postReadListClear().then(response => {
          if (response.data.res === 0) {
            this.$message({
              type: 'success',
              message: '清空成功'
            })
            this.num = 0
            this.MessageList = []
          } else {
            this.$message({
              type: 'error',
              message: '清空失败'
            })
          }
        })
      },
      showMessage() {
        this.show = !this.show
      },
      postAction() {
        this.$refs.resetPasswordForm.validate(valid => {
          if (valid) {
            const confirmText = '密码修改成功后必须重新登录'
            this.$confirm(`${confirmText}， 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const query = {
                name: this.name,
                pwd: this.resetQuery.pwd,
                newpwd: this.resetQuery.newpwd
              }
              common.postChangePwd(query).then(res => {
                if (res.data.res === 0) {
                  this.$alert(`密码修改成功， 请重新登录！`, '提示信息', {
                    confirmButtonText: '确定',
                    callback: () => {
                      this.$store.dispatch('FedLogOut')
                    },
                    beforeClose: () => {
                      this.$store.dispatch('FedLogOut')
                    }
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.desc
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消操作!'
              })
            })
          }
        })
      },
      resetF() {
        this.resetPasswordDialogShow = false
        this.$refs.resetPasswordForm.resetFields()
        this.resetQuery = {
          pwd: '',
          newpwd: '',
          r_password: ''
        }
      },
      ModifyPassword() {
        this.resetPasswordDialogShow = true
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      }
    },
    created() {
      this.name = this.$store.state.user.name
      // console.log(this.$store.state.user)
      this.getMessageList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "flex.css";

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    /*.split span {*/
    /*height: 30px;*/
    /*width: 2px;*/
    /*background-color: #2795d5;*/
    /*}*/
    .v-email {
      display: inline-block;
      height: 50px;
      line-height: 60px;
      padding-right: 15px;
      .el-button--medium {
        font-size: 18px;
      }
      /*cursor: pointer;*/
      /*.svg-icon {*/
      /*width: 1.5em;*/
      /*height: 1.5em;*/
      /*color: #2795d5;*/
      /*}*/
      /*.el-badge__content {*/
      /*&.is-fixed {*/
      /*top: 19px;*/
      /*}*/
      /*}*/
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          /*span {*/
          /*img {*/
          /*display: inline-block;*/
          /*margin-right: 15px;*/
          /*}*/
          /*}*/
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 17px;
            font-size: 12px;
          }
        }
      }
    }
  }

  .message-con {
    position: absolute;
    width: 290px;
    height: 245px;
    border: 1px solid #2795d5;
    box-sizing: border-box;
    background: white;
    right: 100px;
    top: 50px;
    z-index: 9;
    .message-title {
      position: relative;
      background: #2795d5;
      height: 45px;
      font-size: 16px;
      color: white;
      .mess-con {
        padding-left: 10px;
      }
      .mess-dele {
        padding-right: 10px;
      }
      .sanj {
        img {
          display: block;
          width: 26px;
          height: 11px;
          position: absolute;
          top: -10px;
          right: 10px;
          z-index: 9999;
        }
      }
    }
    .message-list {
      width: 100%;
      height: 185px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 1px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 1px;
        background-image: -webkit-gradient(linear, right bottom, left top, color-stop(0.3, #2795d5), color-stop(0.6, #2795d5), color-stop(0.9, #2795d5))
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.8);
        -moz-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.8);
        -o-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.8);
        box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.8);
        background-color: #f7f7f7;
      }
      ul {
        width: 100%;
        padding: 0;
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        -webkit-padding-start: 0;
        li {
          /*width: 95%;*/
          padding: 10px 5px;
          list-style: none;
          text-align: left;
          /*padding-bottom: 15px;*/
          cursor: pointer;
          &:hover {
            background-color: #f0f0f0;
            /*p, i {*/
            /*color: #fff;*/
            /*}*/
          }
          p {
            font-size: 14px;
            color: #6c6c6c;
            margin-right: 5px;
            border-left: 3px solid #2795d5;
            text-align: left;
            text-indent: 3px;
          }
          i {
            line-height: 0;
            font-style: normal;
            font-size: 12px;
            color: #b1b1b1;
            margin-right: 5px;
            text-align: right;
            display: block;
          }
        }
      }
    }
  }
</style>
<style scoped>

</style>

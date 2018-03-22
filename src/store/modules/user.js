import { loginByUsername, logout } from '@/api/login'
import { getUserName, setUserName, removeUserName } from '@/utils/auth'

const user = {
  state: {
    user: '',
    // token: getToken(),
    name: getUserName()
  },
  mutations: {
    // SET_TOKEN: (state, token) => {
    //   state.token = token
    // },
    SET_NAME: (state, name) => {
      state.name = name
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          commit('SET_NAME', userInfo.username)
          setUserName(userInfo.username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_NAME', '')
          removeUserName()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user

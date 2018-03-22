import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    token: 'admin',
    introduction: '我是超级管理员',
    name: 'Super Admin'
  },
  editor: {
    token: 'editor',
    introduction: '我是编辑',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { name } = JSON.parse(config.body)
    return userMap[name]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}

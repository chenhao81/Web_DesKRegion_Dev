import request from '@/utils/request'

export function loginByUsername(name, pwd) {
  const data = {
    name,
    pwd
  }
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }


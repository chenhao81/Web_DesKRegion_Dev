import request from '@/utils/request'

export function postChangePwd(name, pwd, newpwd) {
  const data = {
    name,
    pwd,
    newpwd
  }
  return request({
    url: '/sys/changepwd',
    method: 'post',
    data
  })
}

// 信息未读取条数
export function getUnreadList() {
  return request({
    url: '/notify/unread',
    method: 'post'
  })
}

// 未删除的消息
export function getReadList(start, end) {
  return request({
    url: '/notify/get',
    method: 'post',
    data: Object.assign({}, { start, end })
  })
}

// 清空信息
export function postReadListClear() {
  return request({
    url: '/notify/clear',
    method: 'post'
  })
}

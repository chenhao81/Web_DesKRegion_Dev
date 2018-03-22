import request from '@/utils/request'

// 服务器状态
export function getServerStatus() {
  return request({
    url: '/server/stat',
    method: 'post'
  })
}

// 云终端信息
export function getTerminalInfo() {
  return request({
    url: '/term/stat',
    method: 'post'
  })
}

// 加入区域中心
export function postCenterJoin(query) {
  return request({
    url: '/sys/joincenter',
    method: 'post',
    data: Object.assign({}, query)
  })
}

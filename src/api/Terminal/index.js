import request from '@/utils/request'

// 获取终端
export function getTerminalSearchList(query) {
  return request({
    url: '/term/search',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端重启
export function postTerminalRebort(query) {
  return request({
    url: '/term/reboot',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端关机
export function postTerminalShutdown(query) {
  return request({
    url: '/term/shutdown',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端删除
export function postTerminalDel(query) {
  return request({
    url: '/term/delete',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端编辑
export function postTerminalEdit(query) {
  return request({
    url: '/term/edit',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端还原镜像
export function postTerminalRecover(query) {
  return request({
    url: '/term/recover',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 获取终端IP设置
export function getTerminalIp(query) {
  return request({
    url: '/term/getip',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端IP设置
export function postTerminalIpSet(query) {
  return request({
    url: '/term/setip',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 终端生成镜像
export function postTerminalToImage(query) {
  return request({
    url: '/term/createimage',
    method: 'post',
    data: Object.assign({}, query)
  })
}

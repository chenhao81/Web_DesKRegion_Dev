import request from '@/utils/request'

// 获取用户组
export function getUserGroupList() {
  return request({
    url: '/group/list',
    method: 'post'
  })
}

// 添加用户组
export function postUserGroupAdd(query) {
  return request({
    url: '/group/add',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 编辑用户组
export function postUserGroupEdit(query) {
  return request({
    url: '/group/edit',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 删除用户组
export function postUserGroupDel(query) {
  return request({
    url: '/group/delete',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 添加用户
export function postUserAdd(query) {
  return request({
    url: '/user/add',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 编辑用户
export function postUserEdit(query) {
  return request({
    url: '/user/edit',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 删除用户
export function postUserDel(query) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 获取某用户组下的用户
export function getUserList(query) {
  return request({
    url: '/user/list',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 查询用户
export function getUserSearch(query) {
  return request({
    url: '/user/search',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 查询用户
export function postUserReset(query) {
  return request({
    url: '/user/reset',
    method: 'post',
    data: Object.assign({}, query)
  })
}

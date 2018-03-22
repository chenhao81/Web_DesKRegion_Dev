import request from '@/utils/request'

// 镜像列表
export function getList() {
  return request({
    url: '/image/list',
    method: 'post'
  })
}

// 镜像文件列表
export function getFileList() {
  return request({
    url: '/image/vfiles',
    method: 'post'
  })
}

// 搜索镜像列表
export function searchList(query) {
  return request({
    url: '/image/search',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 镜像添加
export function postImageAdd(query) {
  return request({
    url: '/image/add',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 镜像编辑
export function postImageEdit(query) {
  return request({
    url: '/image/edit',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 镜像删除
export function postImageDel(query) {
  return request({
    url: '/image/delete',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 镜像复制
export function postImageCopy(query) {
  return request({
    url: '/image/copy',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 镜像绑定的用户组
export function getImageBindGroups(query) {
  return request({
    url: '/image/getbindgroups',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 获取主镜像
export function getPrimaryImage() {
  return request({
    url: '/image/getprimary',
    method: 'post'
  })
}

// 由UUID获取镜像信息
export function getImageInfo(query) {
  return request({
    url: '/image/get',
    method: 'post',
    data: Object.assign({}, query)
  })
}

// 镜像下载
export function getImageDownLoad(query) {
  return request({
    url: '/image/download',
    method: 'post',
    data: Object.assign({}, query)
  })
}

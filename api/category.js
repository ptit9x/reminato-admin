import request from '@/utils/request'

export function getListCategory (params) {
  return request({
    url: '/manager/categories',
    method: 'get',
    params
  })
}

export function createCategory (user) {
  return request({
    url: '/manager/categories',
    method: 'post',
    data: user
  })
}

export function getCategory (id) {
  return request({
    url: '/manager/categories/' + id,
    method: 'get'
  })
}

export function updateCategory (id, data) {
  return request({
    url: '/manager/categories/' + id,
    method: 'put',
    data
  })
}

export function deleteCategory (id) {
  return request({
    url: '/manager/categories/' + id,
    method: 'delete'
  })
}

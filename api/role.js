import request from '@/utils/request'

export function getListRole (params) {
  return request({
    url: '/manager/roles',
    method: 'get',
    params
  })
}

export function createRole (user) {
  return request({
    url: '/manager/roles',
    method: 'post',
    data: user
  })
}

export function getRole (id) {
  return request({
    url: '/manager/roles/' + id,
    method: 'get'
  })
}

export function updateRole (id, data) {
  return request({
    url: '/manager/roles/' + id,
    method: 'put',
    data
  })
}

export function deleteRole (id) {
  return request({
    url: '/manager/roles/' + id,
    method: 'delete'
  })
}

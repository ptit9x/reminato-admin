import request from '@/utils/request'

export function getListUser (params) {
  return request({
    url: '/manager/users',
    method: 'get',
    params
  })
}

export function createUser (user) {
  return request({
    url: '/manager/users',
    method: 'post',
    data: user
  })
}

export function getUser (id) {
  return request({
    url: '/manager/users/' + id,
    method: 'get'
  })
}

export function updateUser (id, data) {
  return request({
    url: '/manager/users/' + id,
    method: 'put',
    data
  })
}

export function deleteUser (id) {
  return request({
    url: '/manager/users/' + id,
    method: 'delete'
  })
}

export function registerUser (user) {
  return request({
    url: '/register',
    method: 'post',
    data: user
  })
}

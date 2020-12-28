import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/login-manager',
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: '/staffs/profile',
    method: 'get'
  })
}

export function updateProfile (data) {
  return request({
    url: '/staffs/profile',
    method: 'put',
    data
  })
}

export function updatePassword (data) {
  return request({
    url: '/staffs/password',
    method: 'patch',
    data
  })
}

export function getListStaff (params) {
  return request({
    url: '/manager/staffs',
    method: 'get',
    params
  })
}

export function createStaff (data) {
  return request({
    url: '/manager/staffs',
    method: 'post',
    data
  })
}

export function getStaff (id) {
  return request({
    url: '/manager/staffs/' + id,
    method: 'get'
  })
}

export function updateStaff (id, data) {
  return request({
    url: '/manager/staffs/' + id,
    method: 'put',
    data
  })
}

export function deleteStaff (id) {
  return request({
    url: '/manager/staffs/' + id,
    method: 'delete'
  })
}

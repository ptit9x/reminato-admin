import request from '@/utils/request'

export function getListMedia (params) {
  return request({
    url: '/manager/media',
    method: 'get',
    params
  })
}

export function createMedia (data) {
  return request({
    url: '/manager/media',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getMedia (id) {
  return request({
    url: '/manager/media/' + id,
    method: 'get'
  })
}

export function deleteMedia (id) {
  return request({
    url: '/manager/media/' + id,
    method: 'delete'
  })
}

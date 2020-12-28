import request from '@/utils/request'

export function getListOrder (params) {
  return request({
    url: '/manager/orders',
    method: 'get',
    params
  })
}

export function getOrder (id) {
  return request({
    url: '/manager/orders/' + id,
    method: 'get'
  })
}

export function updateStatusOrder (id, data) {
  return request({
    url: '/manager/orders/status/' + id,
    method: 'put',
    data
  })
}

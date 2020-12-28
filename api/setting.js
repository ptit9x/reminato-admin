import request from '@/utils/request'

export function getSetting () {
  return request({
    url: '/manager/settings',
    method: 'get'
  })
}

export function updateSetting (data) {
  return request({
    url: '/manager/settings',
    method: 'put',
    data
  })
}

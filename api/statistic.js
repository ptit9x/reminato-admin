import request from '@/utils/request'

export function getStatistics (params) {
  return request({
    url: '/manager/statistics',
    method: 'get',
    params
  })
}

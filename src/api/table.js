import request from '@/utils/db_request'

export function fetchMarketingList() {
  return request({
    url: '/list',
    method: 'get'
  })
}

export function createMarketingTask(data) {
  return request({
    url: '/create',
    method: 'post',
    data
  })
}

export function updateMarketingTask(data) {
  return request({
    url: '/update',
    method: 'post',
    data
  })
}

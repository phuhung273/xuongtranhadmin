import request from '@/utils/db_request'

export function fetchMarketingList(query) {
  return request({
    url: '/marketing/list',
    method: 'get',
    params: query
  })
}

export function createMarketingTask(data) {
  return request({
    url: '/marketing/create',
    method: 'post',
    data
  })
}

export function updateMarketingTask(data) {
  return request({
    url: '/marketing/update',
    method: 'post',
    data
  })
}

export function deleteMarketingTask(data) {
  return request({
    url: '/marketing/delete',
    method: 'post',
    data
  })
}

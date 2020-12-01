import request from '@/utils/db_request'

const endpoint = '/api/marketings'

export function fetchMarketingList(query) {
  return request({
    url: endpoint,
    method: 'get',
    params: query
  })
}

export function createMarketingTask(data) {
  return request({
    url: endpoint,
    method: 'post',
    data
  })
}

export function updateMarketingTask(data) {
  return request({
    url: endpoint,
    method: 'put',
    data
  })
}

export function deleteMarketingTask(data) {
  return request({
    url: endpoint,
    method: 'delete',
    data
  })
}

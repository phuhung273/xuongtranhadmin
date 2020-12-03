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

export function updateMarketingTask(data, id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'put',
    data
  })
}

export function deleteMarketingTask(id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'delete',
  })
}

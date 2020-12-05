import request from '@/utils/db_request'

const endpoint = '/api/dashboard'

export function fetchMarketingList(query) {
  return request({
    url: `${endpoint}/marketing`,
    method: 'get',
    params: query
  })
}

export function fetchSalesList(query) {
  return request({
    url: `${endpoint}/sale`,
    method: 'get',
    params: query
  })
}

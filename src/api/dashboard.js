import request from '@/utils/db_request'

export function fetchMarketingList(query) {
  return request({
    url: '/api/dashboard/marketing',
    method: 'get',
    params: query
  })
}

export function fetchSalesList(query) {
  return request({
    url: '/api/dashboard/sale',
    method: 'get',
    params: query
  })
}

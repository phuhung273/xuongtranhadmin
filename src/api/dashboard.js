import request from '@/utils/db_request'

export function fetchMarketingList(query) {
  return request({
    url: '/dashboard/marketing',
    method: 'get',
    params: query
  })
}

export function fetchSalesList(query) {
  return request({
    url: '/dashboard/sales',
    method: 'get',
    params: query
  })
}

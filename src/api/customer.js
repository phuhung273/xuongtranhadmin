import request from '@/utils/db_request'

export function fetchCustomerFunnel(query) {
  return request({
    url: '/customer/list',
    method: 'get',
    params: query
  })
}

export function updateCustomerFunnel(data) {
  return request({
    url: '/customer/update',
    method: 'post',
    data
  })
}

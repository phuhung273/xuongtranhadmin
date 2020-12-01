import request from '@/utils/db_request'

export function fetchCustomerFunnel(query) {
  return request({
    url: '/api/customer/list',
    method: 'get',
    params: query
  })
}

export function fetchOneCustomer(id) {
  return request({
    url: '/api/customer/list/' + id,
    method: 'get'
  })
}

export function updateCustomerFunnel(data) {
  return request({
    url: '/api/customer/update',
    method: 'post',
    data
  })
}

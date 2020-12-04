import request from '@/utils/db_request'

const endpoint = '/api/customer'

export function fetchCustomerFunnel(query) {
  return request({
    url: endpoint,
    method: 'get',
    params: query
  })
}

export function fetchOneCustomer(id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'get'
  })
}

export function updateCustomerFunnel(data, id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'put',
    data
  })
}

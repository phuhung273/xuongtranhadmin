import request from '@/utils/db_request'

const endpoint = '/api/sales'

export function fetchCustomerList(query) {
  return request({
    url: endpoint,
    method: 'get',
    params: query
  })
}

export function createCustomer(data) {
  return request({
    url: endpoint,
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: endpoint,
    method: 'put',
    data
  })
}

export function deleteCustomer(data) {
  return request({
    url: endpoint,
    method: 'delete',
    data
  })
}

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

export function updateCustomer(data, id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'put',
    data
  })
}

export function deleteCustomer(id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'delete',
  })
}

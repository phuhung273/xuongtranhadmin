import request from '@/utils/db_request'

export function fetchCustomerList(query) {
  return request({
    url: '/sales/list',
    method: 'get',
    params: query
  })
}

export function createCustomer(data) {
  return request({
    url: '/sales/create',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/sales/update',
    method: 'post',
    data
  })
}

export function deleteCustomer(data) {
  return request({
    url: '/sales/delete',
    method: 'post',
    data
  })
}

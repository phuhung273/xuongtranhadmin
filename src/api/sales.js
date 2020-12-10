import request from '@/utils/db_request'
import axios from 'axios'
import { replaceKeys } from '@/utils/object'

const endpoint = '/api/sales'

export function fetchCustomerList(query) {
  return request({
    url: endpoint,
    method: 'get',
    params: query,
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.items.forEach(item => {
        return replaceKeys(item, {
          status_name: 'status',
          product_name: 'product',
          sale_lead_name: 'lead'
        })
      })

      return data
    })
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
    method: 'delete'
  })
}

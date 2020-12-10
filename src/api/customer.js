import request from '@/utils/db_request'
import axios from 'axios'
import { replaceKeys } from '@/utils/object'

const endpoint = '/api/customer'

export function fetchCustomerFunnel(query) {
  return request({
    url: endpoint,
    method: 'get',
    params: query,
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.items.forEach(item => {
        return replaceKeys(item, {
          status_name: 'status'
        })
      })

      return data
    })
  })
}

export function fetchOneCustomer(id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'get',
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

export function updateCustomerFunnel(data, id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'put',
    data
  })
}

import request from '@/utils/db_request'
import axios from 'axios'
import { replaceKeys } from '@/utils/object'

const endpoint = '/api/marketings'

export function fetchMarketingList(query) {
  return request({
    url: endpoint,
    method: 'get',
    params: query,
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.items.forEach(item => {
        return replaceKeys(item, {
          source_name: 'source',
          product_name: 'product',
          lead_name: 'lead'
        })
      })

      return data
    })
  })
}

export function createMarketingTask(data) {
  return request({
    url: endpoint,
    method: 'post',
    data
  })
}

export function updateMarketingTask(data, id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'put',
    data
  })
}

export function deleteMarketingTask(id) {
  return request({
    url: `${endpoint}/${id}`,
    method: 'delete'
  })
}

import request from '@/utils/db_request'
import axios from 'axios'
import { replaceKeys } from '@/utils/object'

const endpoint = '/api/dashboard'

export function fetchSummary(query) {
  return request({
    url: `${endpoint}`,
    method: 'get',
    params: query
  })
}

export function fetchMarketingList(query) {
  return request({
    url: `${endpoint}/marketing`,
    method: 'get',
    params: query
  })
}

export function fetchSalesList(query) {
  return request({
    url: `${endpoint}/sale`,
    method: 'get',
    params: query
  })
}

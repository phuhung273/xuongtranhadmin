<template>
  <div>
    <h3>Chi tiết các khách hàng vào ngày {{ time | parseHCMDate }}</h3>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="customer" label="Khách hàng" width="180" />
      <el-table-column prop="status" label="Tình trạng" />
    </el-table>
  </div>
</template>

<script>
import { parseHCMDate } from '@/utils/time'

export default {
  filters: {
    parseHCMDate
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    time: {
      type: String,
      default: ''
    }
  }
}
</script>

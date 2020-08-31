<template>
  <div>
    <div>Tổng số KH: {{ data.result || 0 }}</div>
    <br />

    <div v-for="key in statuses" :key="key">
      <el-tag :type="key | statusFilter">{{ key }}</el-tag>
      <span>{{ data[key] }}</span>
    </div>

    <div v-if="data.result">
      <br />
      <div>Tình trạng</div>
      <div v-for="key in stages" :key="key">
        <span>{{ key }}: {{ data.status[key] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { keepKeys } from '@/utils/object'
import { statusOptions } from '@/settings'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        'Non-organic': 'success',
        Organic: 'info',
        Lost: 'danger',
      }
      return statusMap[status]
    },
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    statuses() {
      const deleted = keepKeys(['Non-organic', 'Organic', 'Lost'], this.data)
      const keys = Object.keys(deleted)
      return keys
    },
    stages() {
      const status = this.data.status
      if (status !== undefined) {
        const deleted = keepKeys(statusOptions, status)

        const keys = Object.keys(deleted)
        return keys
      }

      return undefined
    },
  },
}
</script>

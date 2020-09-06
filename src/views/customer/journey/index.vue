<template>
  <div class="app-container">
    <!-- <el-container v-loading="listLoading" >

    </el-container> -->
  </div>
</template>

<script>
import { fetchCustomerFunnel } from '@/api/customer'

import { parseHCMDate } from '@/utils/time'
import { statusOptions } from '@/settings'

export default {
  name: 'Journey',
  filters: {
    parseHCMDate
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {},
  methods: {}
}
</script>

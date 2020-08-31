<template>
  <div class="app-container">
    <!-- <el-container v-loading="listLoading" >

    </el-container> -->
    <google-ad unit="AdUnitName"></google-ad>
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

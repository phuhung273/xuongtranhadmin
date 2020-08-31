<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Khách hàng" min-width="200">
      <template slot-scope="scope">{{ scope.row.customer }}</template>
    </el-table-column>

    <el-table-column label="Nhu cầu" width="200">
      <template slot-scope="scope">{{ scope.row.demand }}</template>
    </el-table-column>

    <el-table-column label="Tình trạng" width="150">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | statusFilter" effect="dark">{{ row.status }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchCustomerFunnel } from '@/api/customer'

export default {
  filters: {
    statusFilter(status) {
      //   const statusMap = {
      //     success: 'success',
      //     pending: 'danger'
      //   }

      const statusMap = {
        Hello: 'info',
        Consulting: 'info',
        'Design Pick-up': 'warning',
        'Contract Sent': 'success'
      }

      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //   transactionList().then(response => {
      //     this.list = response.data.items.slice(0, 8)
      //   })

      fetchCustomerFunnel(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.items
      })
    }
  }
}
</script>

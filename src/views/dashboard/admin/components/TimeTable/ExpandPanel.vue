<template>
  <el-table :data="tableData" style="width: 100%">
    <!-- <el-table-column
      v-for="product in productOptions"
      :key="product"
      :label="product"
      align="center"
    >
      <el-table-column
        v-for="lead in leadOptions"
        :key="lead"
        :label="lead"
        :prop="product + lead"
      />
    </el-table-column>-->
    <el-table-column
      v-for="product in productOptions"
      :key="product"
      :label="product"
      align="center"
    >
      <el-table-column v-for="lead in leadOptions" :key="lead" :label="lead">
        <template slot-scope="{row}">
          <expand-cell :data="row[product + lead]" />
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import { salesLeadOptions, productOptions } from '@/settings'

import ExpandCell from './ExpandCell'

export default {
  components: {
    ExpandCell,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      tableData: [],
      // productOptions: ['Tranh Canvas', 'Tranh vẽ tường'],
      // leadOptions: ['Facebook inbox', 'Hotline call', 'Zalo call/inbox'],
      productOptions: productOptions,
      leadOptions: salesLeadOptions,
    }
  },
  created() {
    // console.log(this.data)
    const row = {}
    for (const product in this.data) {
      for (const lead in this.data[product]) {
        row[product + lead] = this.data[product][lead]
      }
    }
    // console.log(row)

    this.tableData.push(row)
    // console.log(this.tableData)
  },
}
</script>

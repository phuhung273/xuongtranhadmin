<template>
  <el-table :data="tableData" style="width: 100%">
    <!-- <el-table-column label="Tranh Canvas" align="center">
      <el-table-column label="Inbox" align="center">
          <span>{{ row['Tranh Canvas']['Facebook inbox'] }}</span>
        </el-table-column>
        <el-table-column label="Hotline" align="center">
          <span>{{ row['Tranh Canvas']['Hotline call'] }}</span>
        </el-table-column>
        <el-table-column label="Zalo" align="center">
          <span>{{ row['Tranh Canvas']['Zalo inbox/call'] }}</span>
      </el-table-column>
    </el-table-column>-->
    <el-table-column
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
    </el-table-column>
  </el-table>
</template>

<script>
export default {
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
      productOptions: ['Tranh Canvas', 'Tranh vẽ tường'],
      leadOptions: ['Facebook inbox', 'Hotline call', 'Zalo call/inbox'],
    }
  },
  created() {
    const row = {}
    for (const product in this.data) {
      for (const lead in this.data[product]) {
        row[product + lead] = this.data[product][lead]
      }
    }

    this.tableData.push(row)
    // console.log(this.tableData)
  },
}
</script>

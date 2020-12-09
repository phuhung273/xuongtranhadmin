<template>
  <el-table
    ref="list"
    v-loading="loading"
    :data="list"
    :default-sort="{ prop: 'time', order: 'descending' }"
    height="500"
    stripe
    style="width: 100%"
    class="clickable-rows"
    @row-click="rowClicked"
  >
    <el-table-column type="expand">
      <template slot-scope="{ row }">
        <expand-panel :data="row.detail" />
      </template>
    </el-table-column>

    <!-- <el-table-column label="Ngày" width="180">
      <template slot-scope="{ row }">{{ row.time | parseHCMDate }}</template>
    </el-table-column>-->
    <el-table-column
      label="Ngày"
      sortable
      width="180"
      prop="time"
      :formatter="timeFormatter"
    />

    <el-table-column label="Marketing">
      <template slot-scope="{ row }">
        <marketing-cell :data="row.marketing" />
      </template>
    </el-table-column>

    <el-table-column label="Sales">
      <template slot-scope="{ row }">
        <sales-cell :data="row.sale" />
      </template>
    </el-table-column>

    <el-table-column label="Khách Hàng">
      <template slot-scope="{ row }">
        <customer-cell :data="row.customer" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { parseHCMDate } from '@/utils/time'
import MarketingCell from './MarketingCell'
import CustomerCell from './CustomerCell'
import SalesCell from './SalesCell'
import ExpandPanel from './ExpandPanel'

export default {
  components: {
    MarketingCell,
    CustomerCell,
    ExpandPanel,
    SalesCell
  },
  filters: {
    parseHCMDate
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    rowClicked(row) {
      this.$refs.list.toggleRowExpansion(row)
    },
    timeFormatter(row, col, value, index) {
      return parseHCMDate(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.clickable-rows {
  ::v-deep tbody tr td {
    cursor: pointer;
    white-space: pre;
    .cell {
      white-space: pre;
    }
  }

  ::v-deep .el-table__expanded-cell {
    cursor: default;
  }
}
</style>

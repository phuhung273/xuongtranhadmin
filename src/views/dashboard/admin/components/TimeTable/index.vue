<template>
  <el-table
    ref="list"
    v-loading="listLoading"
    :data="list"
    height="500"
    stripe
    style="width: 100%"
    class="clickable-rows"
    @row-click="rowClicked"
  >
    <el-table-column type="expand">
      <template slot-scope="{ row }">
        <expand-panel :data="row.expand" :time="row.time" />
      </template>
    </el-table-column>
    <el-table-column label="Ngày" width="180">
      <template slot-scope="{ row }">{{ row.time | parseHCMDate }}</template>
    </el-table-column>
    <el-table-column label="Marketing">
      <template slot-scope="{ row }">
        <marketing-cell :data="row.marketing" />
      </template>
    </el-table-column>
    <el-table-column label="Sales">
      <template slot-scope="{ row }">
        <sales-cell :data="row.sales" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchMarketingList, fetchSalesList } from '@/api/dashboard'
import { parseHCMDate } from '@/utils/time'
import MarketingCell from './MarketingCell'
import SalesCell from './SalesCell'
import ExpandPanel from './ExpandPanel'

export default {
  components: {
    MarketingCell,
    SalesCell,
    ExpandPanel
  },
  filters: {
    parseHCMDate
  },
  data() {
    return {
      list: undefined,
      listQuery: undefined,
      listLoading: true
    }
  },
  created() {
    const numberNow = Date.now()
    const dateNow = new Date(numberNow)
    const last7Day = new Date()
    last7Day.setDate(dateNow.getDate() - 7)

    this.listQuery = {
      from: last7Day,
      to: dateNow
    }

    // console.log(this.listQuery)
    this.fetchData()

    // console.log('created')
  },
  methods: {
    rowClicked(row) {
      this.$refs.list.toggleRowExpansion(row)
    },
    async fetchData() {
      const marketingRes = await fetchMarketingList(this.listQuery)
      const marketingList = marketingRes.data.items
      const salesRes = await fetchSalesList(this.listQuery)
      const salesList = salesRes.data.items
      // console.log(marketingList)

      this.prepareTableData(marketingList, salesList)
    },
    prepareTableData(marketing, sales) {
      const uniqueTimeList = this.prepareDistinctTimeList(marketing, sales)
      // console.log(uniqueTimeList)

      this.list = this.prepareSummarizedList(uniqueTimeList)
      this.listLoading = false
    },
    prepareDistinctTimeList(marketing, sales) {
      const distinctTimeMarketing = [...new Set(marketing.map(x => x.time))]
      const distinctTimeSales = [...new Set(sales.map(x => x.time))]
      const distinctTimeConcat = distinctTimeMarketing.concat(distinctTimeSales)
      const distinctTime = [...new Set(distinctTimeConcat)]

      const uniqueTimeList = distinctTime.map(time => {
        const row = {
          marketing: marketing.filter(x => x.time === time),
          sales: sales.filter(x => x.time === time),
          time: time
        }

        // console.log(row)
        return row
      })

      return uniqueTimeList
    },
    prepareSummarizedList(uniqueTimeList) {
      const newList = []
      for (const { marketing, sales, time } of uniqueTimeList) {
        const marketingResult = this.summarizeMarketing(marketing)
        const salesResult = this.summarizeSales(sales)
        newList.push({
          marketing: marketingResult,
          sales: salesResult,
          time: time,
          expand: sales
        })
      }

      return newList
    },
    summarizeMarketing(marketing) {
      const distinctMarketingSource = new Set(marketing.map(x => x.source))
      const marketingResult = {}

      for (const uniqueSource of distinctMarketingSource) {
        const tempResult = {}
        for (const { source, product, result } of marketing) {
          if (source === uniqueSource) {
            tempResult[product] = tempResult[product]
              ? tempResult[product] + result
              : result
          }
        }
        marketingResult[uniqueSource] = tempResult
      }

      return marketingResult
    },
    summarizeSales(sales) {
      const distinctSalesStatus = new Set(sales.map(x => x.status))
      const salesResult = {}

      for (const uniqueStatus of distinctSalesStatus) {
        for (const { status } of sales) {
          if (status === uniqueStatus) {
            salesResult[status] = salesResult[status]
              ? salesResult[status] + 1
              : 1
          }
        }
      }

      return salesResult
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

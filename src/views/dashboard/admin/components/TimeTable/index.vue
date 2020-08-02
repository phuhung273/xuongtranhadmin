<template>
  <div>
    <div class="filter-container">
      <el-date-picker
        v-model="value"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="Tới"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        :picker-options="pickerOptions"
        @change="handleRangeChange"
      />

      <el-button v-waves class="filter-item filter-btn" type="primary" @click="handleFilter">Áp dụng</el-button>
    </div>

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
          <expand-panel :data="row.sales" />
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
      <el-table-column label="Khách Hàng">
        <template slot-scope="{ row }">
          <customer-cell :data="row.customer" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchMarketingList, fetchSalesList } from '@/api/dashboard'
import { parseHCMDate, last } from '@/utils/time'
import MarketingCell from './MarketingCell'
import CustomerCell from './CustomerCell'
import SalesCell from './SalesCell'
import ExpandPanel from './ExpandPanel'

import waves from '@/directive/waves' // waves directive
export default {
  directives: {
    waves,
  },
  components: {
    MarketingCell,
    CustomerCell,
    ExpandPanel,
    SalesCell,
  },
  filters: {
    parseHCMDate,
  },
  data() {
    return {
      list: undefined,
      listQuery: undefined,
      listLoading: true,
      sortOptions: [
        {
          label: '1 tuần trước',
          number: 7,
        },
        {
          label: '2 tuần trước',
          number: 14,
        },
        {
          label: '1 tháng trước',
          number: 30,
        },
        {
          label: '2 tháng trước',
          number: 60,
        },
        {
          label: '3 tháng trước',
          number: 90,
        },
      ],
      fromOptions: undefined,
      toOptions: undefined,
      pickerOptions: {
        shortcuts: [
          {
            text: 'Tuần trước',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: 'Tháng trước',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '3 tháng trước',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      value: '',
    }
  },
  created() {
    this.listQuery = {
      from: last(7, 'day'),
      to: new Date(),
    }

    this.fromOptions = [...this.sortOptions]
    this.toOptions = [
      {
        label: 'Hôm nay',
        number: 0,
      },
      ...this.sortOptions,
    ]

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
      const distinctTimeMarketing = [...new Set(marketing.map((x) => x.time))]
      const distinctTimeSales = [...new Set(sales.map((x) => x.time))]
      const distinctTimeConcat = distinctTimeMarketing.concat(distinctTimeSales)
      const distinctTime = [...new Set(distinctTimeConcat)]

      const uniqueTimeList = distinctTime.map((time) => {
        const row = {
          marketing: marketing.filter((x) => x.time === time),
          sales: sales.filter((x) => x.time === time),
          time: time,
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
        const customerResult = this.summarizeCustomer(sales)
        const salesResult = this.summarizeSales(sales)
        newList.push({
          marketing: marketingResult,
          customer: customerResult,
          sales: salesResult,
          time: time,
        })
      }

      return newList
    },
    summarizeMarketing(marketing) {
      // const distinctMarketingSource = new Set(marketing.map((x) => x.source))
      // const marketingResult = {}

      // for (const uniqueSource of distinctMarketingSource) {
      //   const tempResult = {}
      //   for (const { source, product, result } of marketing) {
      //     if (source === uniqueSource) {
      //       tempResult[product] = tempResult[product]
      //         ? tempResult[product] + result
      //         : result
      //     }
      //   }
      //   marketingResult[uniqueSource] = tempResult
      // }

      const distinctMarketingProduct = new Set(marketing.map((x) => x.product))
      const marketingResult = {}

      for (const uniqueProduct of distinctMarketingProduct) {
        const tempResult = {}
        for (const { product, lead, result } of marketing) {
          if (product === uniqueProduct) {
            tempResult[lead] = tempResult[lead]
              ? tempResult[lead] + result
              : result
          }
        }
        marketingResult[uniqueProduct] = tempResult
      }

      return marketingResult
    },
    summarizeSales(sales) {
      const distinctSalesProduct = new Set(sales.map((x) => x.product))
      const salesResult = {}

      for (const uniqueProduct of distinctSalesProduct) {
        const tempResult = {}
        for (const { product, lead } of sales) {
          if (product === uniqueProduct) {
            tempResult[lead] = tempResult[lead] ? tempResult[lead] + 1 : 1
          }
        }
        salesResult[uniqueProduct] = tempResult
      }

      return salesResult
    },
    summarizeCustomer(sales) {
      const distinctSalesStatus = new Set(sales.map((x) => x.status))
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
    },
    handleRangeChange(range) {
      this.listQuery = {
        from: range[0],
        to: range[1],
      }
      // console.log(this.listQuery)
    },
    handleFilter() {
      this.fetchData()
    },
  },
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

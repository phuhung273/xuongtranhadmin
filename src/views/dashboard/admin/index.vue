<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>-->

    <el-row class="row-chart">
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

        <el-button
          v-waves
          class="filter-item filter-btn"
          type="primary"
          @click="handleFilter"
        >Áp dụng</el-button>
      </div>
      <time-table :list="list" :loading="listLoading" />
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->

    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <div class="chart-wrapper">
          <line-chart
            title="Marketing Performance"
            :chart-data="lineChartData"
            :x-axis="lineChartXAxis"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from '@/components/Chart/LineChart'
import BoxCard from './components/BoxCard'
import TimeTable from './components/TimeTable'

import { parseHCMDate, last } from '@/utils/time'
import { countDistinctKey } from '@/utils/object'

import { fetchMarketingList, fetchSalesList } from '@/api/dashboard'

import waves from '@/directive/waves' // waves directive

import { marketingLeadOptions, salesLeadOptions } from '@/settings'

// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145],
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130],
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130],
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130],
//   },
// }

export default {
  name: 'DashboardAdmin',
  directives: {
    waves,
  },
  components: {
    PanelGroup,
    LineChart,
    BoxCard,
    TimeTable,
  },
  data() {
    return {
      lineChartData: {},
      lineChartXAxis: undefined,
      list: undefined,
      listLoading: true,
      listQuery: undefined,
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
    // console.log(this.listQuery)
    this.fetchData()
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    },
    async fetchData() {
      const marketingRes = await fetchMarketingList(this.listQuery)
      const marketingList = marketingRes.data.items
      const salesRes = await fetchSalesList(this.listQuery)
      const salesList = salesRes.data.items
      // console.log(marketingList)

      this.prepareData(marketingList, salesList)
    },
    prepareData(marketingList, salesList) {
      const uniqueTimeList = this.prepareDistinctTimeList(
        marketingList,
        salesList
      )
      // console.log(uniqueTimeList)

      // Eliminate sales in all objects of array
      const uniqueMarketingTimeList = uniqueTimeList.map(
        ({ sales, ...rest }) => rest
      )

      // Eliminate all but time in all objects of array
      const uniqueTime = uniqueTimeList.map(({ time }) => time)

      this.lineChartXAxis = uniqueTime.map((item) => parseHCMDate(item))

      this.lineChartData = this.prepareMarketingChart(uniqueMarketingTimeList)

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
    prepareMarketingChart(marketingList) {
      // console.log(marketingList)

      const result = {}

      marketingLeadOptions.forEach((item) => {
        result[item] = []
      })

      marketingList.forEach((item) => {
        const tempResult = countDistinctKey(
          marketingLeadOptions,
          'lead',
          item.marketing
        )

        marketingLeadOptions.forEach((lead) => {
          result[lead].push(tempResult[lead])
        })
      })

      // console.log(result)
      return result
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
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.row-chart {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

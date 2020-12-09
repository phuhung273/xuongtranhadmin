<template>
  <div class="dashboard-editor-container">
    <panel-group :list="list" />

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
          >Áp dụng</el-button
        >
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

import { fetchSummary } from '@/api/dashboard'

import waves from '@/directive/waves' // waves directive

import {
  marketingLeadOptions,
  salesLeadOptions,
  productOptions
} from '@/settings'

const organicMap = {
  'Facebook inbox': 'Facebook inbox',
  'Hotline call': 'Call'
}

export default {
  name: 'DashboardAdmin',
  directives: {
    waves
  },
  components: {
    PanelGroup,
    LineChart,
    BoxCard,
    TimeTable
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
            }
          },
          {
            text: 'Tháng trước',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '3 tháng trước',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value: ''
    }
  },
  created() {
    this.listQuery = {
      from: last(1, 'month'),
      to: new Date()
    }
    // console.log(this.listQuery)
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await fetchSummary(this.listQuery)
      const { marketings, sales, customers } = res.data
      this.prepareData(marketings, sales, customers)
    },
    prepareData(marketingList, salesList, customerList) {
      const uniqueTimeList = this.prepareDistinctTimeList(
        marketingList,
        salesList,
        customerList
      )
      // console.log(uniqueTimeList)

      // Eliminate sales in all objects of array
      const uniqueMarketingTimeList = uniqueTimeList.map(
        ({ sales, ...rest }) => rest
      )

      // Eliminate all but time in all objects of array
      const uniqueTime = uniqueTimeList.map(({ time }) => time)

      this.lineChartXAxis = uniqueTime.map(item => parseHCMDate(item))

      this.lineChartData = this.prepareMarketingChart(uniqueMarketingTimeList)

      this.list = this.prepareSummarizedList(uniqueTimeList)
      this.listLoading = false
    },
    prepareDistinctTimeList(marketings, sales, customers) {
      const distinctTimeMarketing = [...new Set(marketings.map(x => x.time))]
      const distinctTimeSales = [...new Set(sales.map(x => x.time))]
      const distinctTimeConcat = distinctTimeMarketing.concat(distinctTimeSales)
      const distinctTime = [...new Set(distinctTimeConcat)]

      const uniqueTimeList = distinctTime.map(time => {
        const row = {
          marketing: marketings.filter(x => x.time === time),
          sale: sales.filter(x => x.time === time),
          customer: customers.filter(x => x.time === time),
          time: time
        }

        // console.log(row)
        return row
      })

      return uniqueTimeList
    },
    prepareSummarizedList(uniqueTimeList) {
      return uniqueTimeList.map(item => {
        const { marketing, sale, time, customer } = item
        return {
          marketing: marketing[0],
          customer: customer[0],
          sale: sale[0],
          // detail: detailtResult,
          time: time
        }
      })
    },
    summarizeDetails(sales, marketing) {
      const distinctSalesProduct = new Set(sales.map(x => x.product_name))
      const salesResult = {}

      // console.log(marketing)

      for (const uniqueProduct of distinctSalesProduct) {
        const tempResult = {}
        for (const { product_name, sale_lead_name, status_name } of sales) {
          if (product_name === uniqueProduct) {
            tempResult[sale_lead_name] = tempResult[sale_lead_name]
              ? tempResult[sale_lead_name]
              : {}

            tempResult[sale_lead_name].result = tempResult[sale_lead_name]
              .result
              ? tempResult[sale_lead_name].result + 1
              : 1

            tempResult[sale_lead_name].status_name = tempResult[sale_lead_name]
              .status_name
              ? tempResult[sale_lead_name].status_name
              : {}
            tempResult[sale_lead_name].status_name[status_name] = tempResult[
              sale_lead_name
            ].status_name[status_name]
              ? tempResult[sale_lead_name].status_name[status_name] + 1
              : 1
          }
        }
        salesResult[uniqueProduct] = tempResult
      }

      // for (const uniqueProduct of distinctSalesProduct) {
      for (const uniqueProduct of productOptions) {
        const tempSalesProduct = salesResult[uniqueProduct]

        if (tempSalesProduct !== undefined) {
          const tempMarketingProduct = marketing[uniqueProduct]

          if (tempMarketingProduct !== undefined) {
            salesLeadOptions.forEach(sale_lead_name => {
              const salesLeadResult = tempSalesProduct[sale_lead_name]

              if (salesLeadResult !== undefined) {
                const salesLeadNumericResult =
                  tempSalesProduct[sale_lead_name].result
                const equivalentMarketingLead = organicMap[sale_lead_name]
                const equivalentMarketingResult = tempMarketingProduct[
                  equivalentMarketingLead
                ]
                  ? tempMarketingProduct[equivalentMarketingLead]
                  : 0

                // console.log(equivalentMarketingResult)

                if (salesLeadNumericResult < equivalentMarketingResult) {
                  salesResult[uniqueProduct][sale_lead_name][
                    'Non-organic'
                  ] = salesLeadNumericResult

                  salesResult[uniqueProduct][sale_lead_name]['Organic'] = 0

                  salesResult[uniqueProduct][sale_lead_name]['Lost'] =
                    equivalentMarketingResult - salesLeadNumericResult
                } else if (salesLeadNumericResult > equivalentMarketingResult) {
                  salesResult[uniqueProduct][sale_lead_name][
                    'Non-organic'
                  ] = equivalentMarketingResult

                  salesResult[uniqueProduct][sale_lead_name]['Organic'] =
                    salesLeadNumericResult - equivalentMarketingResult

                  salesResult[uniqueProduct][sale_lead_name]['Lost'] = 0
                }
              } else {
                const equivalentMarketingLead = organicMap[sale_lead_name]
                const equivalentMarketingResult = tempMarketingProduct[
                  equivalentMarketingLead
                ]
                  ? tempMarketingProduct[equivalentMarketingLead]
                  : 0

                salesResult[uniqueProduct][sale_lead_name] = {}

                salesResult[uniqueProduct][sale_lead_name]['Non-organic'] = 0
                salesResult[uniqueProduct][sale_lead_name]['Organic'] = 0
                salesResult[uniqueProduct][sale_lead_name][
                  'Lost'
                ] = equivalentMarketingResult
              }
            })
          } else {
            salesLeadOptions.forEach(sale_lead_name => {
              const salesLeadResult = tempSalesProduct[sale_lead_name]

              if (salesLeadResult !== undefined) {
                salesResult[uniqueProduct][sale_lead_name]['Non-organic'] = 0
                salesResult[uniqueProduct][sale_lead_name]['Organic'] =
                  salesLeadResult.result
                salesResult[uniqueProduct][sale_lead_name]['Lost'] = 0
              }
            })
          }
        } else {
          const tempMarketingProduct = marketing[uniqueProduct]

          if (tempMarketingProduct !== undefined) {
            salesResult[uniqueProduct] = {}
            salesLeadOptions.forEach(sale_lead_name => {
              const equivalentMarketingLead = organicMap[sale_lead_name]

              // console.log(equivalentMarketingLead)

              const equivalentMarketingResult =
                tempMarketingProduct[equivalentMarketingLead]

              // console.log(equivalentMarketingResult)

              if (equivalentMarketingResult !== undefined) {
                salesResult[uniqueProduct][sale_lead_name] = {}
                salesResult[uniqueProduct][sale_lead_name]['Non-organic'] = 0
                salesResult[uniqueProduct][sale_lead_name]['Organic'] = 0
                salesResult[uniqueProduct][sale_lead_name][
                  'Lost'
                ] = equivalentMarketingResult
              }
            })
          }
        }
      }

      // console.log(salesResult)

      return salesResult
    },
    prepareMarketingChart(marketingList) {
      // console.log(marketingList)

      const result = {}

      marketingLeadOptions.forEach(item => {
        result[item] = []
      })

      marketingList.forEach(item => {
        const tempResult = countDistinctKey(
          marketingLeadOptions,
          'lead_name',
          item.marketing
        )

        marketingLeadOptions.forEach(lead_name => {
          result[lead_name].push(tempResult[lead_name])
        })
      })

      // console.log(result)
      return result
    },
    handleRangeChange(range) {
      this.listQuery = {
        from: range[0],
        to: range[1]
      }
      // console.log(this.listQuery)
    },
    handleFilter() {
      this.fetchData()
    }
  }
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

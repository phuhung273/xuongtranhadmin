<template>
  <!-- <div class="dashboard-container"> -->
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <line-pie-chart :data="chartData" :x-axis="lineChartXAxis" />
    </div>
  </div>
</template>

<script>
import LinePieChart from '@/components/Chart/LinePieChart'

import { last, parseHCMDate } from '@/utils/time'
import { countDistinctKeyByAnotherKey, deleteKeys } from '@/utils/object'

import { marketingLeadOptions, productOptions } from '@/settings'

import { fetchMarketingList } from '@/api/dashboard'
export default {
  name: 'MarketingDashboard',
  components: {
    LinePieChart,
  },
  data() {
    return {
      chartData: {},
      lineChartXAxis: undefined,
      list: undefined,
      listLoading: true,
      listQuery: undefined,
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
    async fetchData() {
      const marketingRes = await fetchMarketingList(this.listQuery)
      const marketingList = marketingRes.data.items
      // console.log(marketingList)

      this.prepareData(marketingList)
    },
    prepareData(marketingList) {
      const uniqueTimeList = this.prepareDistinctTimeList(marketingList)
      // console.log(uniqueTimeList)

      // Eliminate all but time in all objects of array
      const uniqueTime = uniqueTimeList.map(({ time }) => time)

      this.lineChartXAxis = uniqueTime.map((item) => parseHCMDate(item))

      this.chartData = this.prepareMarketingChart(uniqueTimeList)

      this.listLoading = false
    },
    prepareDistinctTimeList(marketing) {
      const distinctTimeMarketing = [...new Set(marketing.map((x) => x.time))]

      const uniqueTimeList = distinctTimeMarketing.map((time) => {
        const row = {
          marketing: marketing.filter((x) => x.time === time),
          time: time,
        }

        // console.log(row)
        return row
      })

      return uniqueTimeList
    },
    prepareMarketingChart(marketingList) {
      // console.log(marketingList)

      const sumKey = 'Tổng conversion'
      const result = {}
      result[sumKey] = []

      marketingLeadOptions.forEach((item) => {
        result[item] = []
      })

      productOptions.forEach((item) => {
        result[item] = []
      })

      result.pieChartData = [['time']]

      marketingList.forEach((item) => {
        const tempLeadResult = countDistinctKeyByAnotherKey(
          marketingLeadOptions,
          'lead',
          'result',
          item.marketing
        )

        let sum = 0
        marketingLeadOptions.forEach((lead) => {
          const leadResult = tempLeadResult[lead]
          result[lead].push(leadResult)
          sum += leadResult
        })
        result[sumKey].push(sum)

        const tempProductResult = countDistinctKeyByAnotherKey(
          productOptions,
          'product',
          'result',
          item.marketing
        )

        productOptions.forEach((product) => {
          result[product].push(tempProductResult[product])
        })

        result.pieChartData[0].push(item.time)
      })

      productOptions.forEach((product) => {
        const tempRow = [product]

        result[product].forEach((item) => {
          tempRow.push(item)
        })

        result.pieChartData.push(tempRow)
      })

      const finalResult = deleteKeys(productOptions, result)
      // console.log(finalResult)
      return finalResult
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
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

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

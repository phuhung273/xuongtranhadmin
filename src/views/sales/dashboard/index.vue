<template>
  <!-- <div class="dashboard-container"> -->
  <div class="dashboard-editor-container">
    <line-multi-pie-chart :data="chartData" :x-axis="lineChartXAxis" />
  </div>
</template>

<script>
import LineMultiPieChart from '@/components/Chart/LineMultiPieChart'

import { last, parseHCMDate } from '@/utils/time'
import { deleteKeys, countDistinctKey } from '@/utils/object'

import { fetchSalesList } from '@/api/dashboard'
export default {
  name: 'SalesDashboard',
  components: {
    LineMultiPieChart
  },
  data() {
    return {
      chartData: {},
      lineChartXAxis: undefined,
      list: undefined,
      productOptions: [],
      leadOptions: [],
      listLoading: true,
      listQuery: undefined
    }
  },
  created() {
    this.listQuery = {
      from: last(7, 'month'),
      to: new Date()
    }
    // console.log(this.listQuery)
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const response = await fetchSalesList(this.listQuery)
      const {
        totalResult,
        resultProduct,
        resultLead,
        productOptions,
        leadOptions
      } = response.data

      this.productOptions = productOptions
      this.leadOptions = leadOptions

      this.prepareData(totalResult, resultProduct, resultLead)
    },
    prepareData(totalResult, resultProduct, resultLead) {
      // Eliminate all but time in all objects of array
      const uniqueTime = totalResult.map(({ time }) => time)

      this.lineChartXAxis = uniqueTime.map(item => parseHCMDate(item))

      this.chartData = this.prepareChartData(
        totalResult,
        resultProduct,
        resultLead
      )

      this.listLoading = false
    },
    prepareChartData(totalResult, resultProduct, resultLead) {
      const sumKey = 'Tổng số khách hàng'
      const finalResult = {}
      finalResult[sumKey] = []

      this.productOptions.forEach(item => {
        finalResult[item] = []
      })

      this.leadOptions.forEach(item => {
        finalResult[item] = []
      })

      finalResult.productPieChartData = [['time']]
      finalResult.leadPieChartData = [['time']]

      totalResult.forEach(item => {
        finalResult[sumKey].push(item.result)
      })

      resultProduct.forEach(item => {
        item.products.forEach(x => {
          const { product, result } = x
          finalResult[product].push(result)
        })

        finalResult.productPieChartData[0].push(item.time)
        finalResult.leadPieChartData[0].push(item.time)
      })

      resultLead.forEach(item => {
        item.leads.forEach(x => {
          const { lead, result } = x
          finalResult[lead].push(result)
        })
      })

      this.productOptions.forEach(product => {
        const tempRow = [product]

        finalResult[product].forEach(item => {
          tempRow.push(item)
        })

        finalResult.productPieChartData.push(tempRow)
      })

      this.leadOptions.forEach(lead => {
        const tempRow = [lead]

        finalResult[lead].forEach(item => {
          tempRow.push(item)
        })

        finalResult.leadPieChartData.push(tempRow)
      })

      const deleteOptions = [...this.productOptions, ...this.leadOptions]
      const lastResult = deleteKeys(deleteOptions, finalResult)
      // console.log(lastResult)
      return lastResult
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

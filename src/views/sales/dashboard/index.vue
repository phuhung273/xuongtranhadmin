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

import { productOptions, salesLeadOptions, statusOptions } from '@/settings'

import { fetchSalesList } from '@/api/dashboard'
export default {
  name: 'SalesDashboard',
  components: {
    LineMultiPieChart,
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
      const response = await fetchSalesList(this.listQuery)
      const list = response.data.items
      // console.log(list)

      this.prepareData(list)
    },
    prepareData(list) {
      const uniqueTimeList = this.prepareDistinctTimeList(list)
      // console.log(uniqueTimeList)

      // Eliminate all but time in all objects of array
      const uniqueTime = uniqueTimeList.map(({ time }) => time)

      this.lineChartXAxis = uniqueTime.map((item) => parseHCMDate(item))

      this.chartData = this.prepareChartData(uniqueTimeList)

      this.listLoading = false
    },
    prepareDistinctTimeList(list) {
      const distinctTime = [...new Set(list.map((x) => x.time))]

      const uniqueTimeList = distinctTime.map((time) => {
        const row = {
          main: list.filter((x) => x.time === time),
          time: time,
        }

        // console.log(row)
        return row
      })

      return uniqueTimeList
    },
    prepareChartData(uniqueTimeList) {
      //   console.log(uniqueTimeList)

      const sumKey = 'Tổng số khách hàng'
      const result = {}
      result[sumKey] = []

      productOptions.forEach((item) => {
        result[item] = []
      })

      salesLeadOptions.forEach((item) => {
        result[item] = []
      })

      result.productPieChartData = [['time']]
      result.leadPieChartData = [['time']]

      uniqueTimeList.forEach((item) => {
        result[sumKey].push(item.main.length)

        const tempProductResult = countDistinctKey(
          productOptions,
          'product',
          item.main
        )

        productOptions.forEach((product) => {
          result[product].push(tempProductResult[product])
        })

        const tempLeadResult = countDistinctKey(
          salesLeadOptions,
          'lead',
          item.main
        )

        salesLeadOptions.forEach((lead) => {
          result[lead].push(tempLeadResult[lead])
        })

        result.productPieChartData[0].push(item.time)
        result.leadPieChartData[0].push(item.time)
      })

      productOptions.forEach((product) => {
        const tempRow = [product]

        result[product].forEach((item) => {
          tempRow.push(item)
        })

        result.productPieChartData.push(tempRow)
      })

      salesLeadOptions.forEach((lead) => {
        const tempRow = [lead]

        result[lead].forEach((item) => {
          tempRow.push(item)
        })

        result.leadPieChartData.push(tempRow)
      })

      const deleteOptions = [...productOptions, ...salesLeadOptions]
      const finalResult = deleteKeys(deleteOptions, result)
      //   console.log(finalResult)
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

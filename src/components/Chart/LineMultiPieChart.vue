<template>
  <div class="dashboard-editor-container" :style="{ width: width }">
    <el-row :gutter="12">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
      >
        <div class="chart-wrapper">
          <resize-chart v-if="leadPieChartOptions" :options="leadPieChartOptions" />
        </div>
      </el-col>

      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
      >
        <div class="chart-wrapper">
          <resize-chart v-if="productPieChartOptions" :options="productPieChartOptions" />
        </div>
      </el-col>
    </el-row>
    <div class="chart-wrapper">
      <resize-chart :options="lineChartOptions" height="400px" @mouseOver="handleMouseOver" />
    </div>
  </div>
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import ResizeChart from './ResizeChart'

const animationMap = {
  0: 'cubicInOut',
  1: 'quadraticOut',
  2: 'linear',
}

const randomAnimation = () => {
  var randomNumberBetween3 = Math.floor(Math.random() * 3)
  return animationMap[randomNumberBetween3]
}

export default {
  name: 'LineMultiPieChart',
  components: {
    ResizeChart,
  },
  props: {
    height: {
      type: String,
      default: '300px',
    },
    width: {
      type: String,
      default: '100%',
    },
    data: {
      type: Object,
      required: true,
    },
    xAxis: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      lineChartOptions: undefined,
      leadPieChartOptions: undefined,
      productPieChartOptions: undefined,
      dimension: 0,
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      },
    },
  },
  created() {
    this.setOptions(this.data)
  },
  methods: {
    handleMouseOver(event) {
      //   console.log(event.dataIndex)
      const dimension = event.dataIndex

      if (dimension !== this.dimension) {
        const { leadPieChartData, productPieChartData } = this.data
        this.dimension = dimension
        this.setLeadPieChartOptions(leadPieChartData)
        this.setProductPieChartOptions(productPieChartData)
      }
    },
    setLineChartOptions(lineChartData) {
      const { series, legend } = this.parseLineData(lineChartData)

      this.lineChartOptions = {
        title: {
          text: '',
          padding: [0, 5],
        },
        xAxis: {
          data: this.xAxis,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        // grid: {
        //   left: 10,
        //   right: 10,
        //   left: 'center',
        //   bottom: 20,
        //   top: 30,
        //   containLabel: true
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: legend,
          icon: 'rect',
          itemGap: 20,
          left: '4%',
          textStyle: {
            fontSize: 14,
          },
        },
        series: series,
      }
    },
    parseLineData(lineChartData) {
      const keys = Object.keys(lineChartData)
      const series = keys.map((key) => {
        return {
          name: key,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 5,
              },
              areaStyle: {
                color: '#f3f8ff',
              },
            },
          },
          data: lineChartData[key],
          animationDuration: 2000,
          animationEasing: randomAnimation(),
          symbolSize: 10,
        }
      })

      return {
        series: series,
        legend: keys,
      }
    },
    labelFormatter(params) {
      const { data, percent, encode } = params
      const index = encode.value[0]
      const result = data[index]
      const label = data[0]

      const rawFormat = `${label}: ${result} (${percent}%)`

      //   console.log(params)

      //   return result === 0 ? '' : '{b}: {@[' + this.dimension + ']} ({d}%)'
      return result === 0 ? '' : rawFormat
    },
    setLeadPieChartOptions(pieChartData) {
      const pieDimension = this.dimension + 1
      //   console.log(this.leadPieChartOptions)
      if (pieChartData !== undefined) {
        const itemName = pieChartData[0][0]
        this.leadPieChartOptions = {
          legend: {
            show: true,
          },
          dataset: {
            source: pieChartData,
          },
          series: [
            {
              type: 'pie',
              id: 'pie',
              radius: '50%',
              center: ['50%', '50%'],
              label: {
                // formatter: '{b}: {@[' + pieDimension + ']} ({d}%)',
                formatter: this.labelFormatter,
                fontSize: 16,
              },
              encode: {
                itemName: itemName,
                value: pieDimension,
                tooltip: pieDimension,
              },
            },
          ],
        }
      }
    },
    setProductPieChartOptions(pieChartData) {
      const pieDimension = this.dimension + 1
      //   console.log(this.productPieChartOptions)
      if (pieChartData !== undefined) {
        const itemName = pieChartData[0][0]
        this.productPieChartOptions = {
          legend: {
            show: true,
          },
          dataset: {
            source: pieChartData,
          },
          series: [
            {
              type: 'pie',
              id: 'pie',
              radius: '50%',
              center: ['50%', '50%'],
              label: {
                // formatter: '{b}: {@[' + pieDimension + ']} ({d}%)',
                formatter: this.labelFormatter,
                fontSize: 16,
              },
              encode: {
                itemName: itemName,
                value: pieDimension,
                tooltip: pieDimension,
              },
            },
          ],
        }
      }
    },
    setOptions(data) {
      const { leadPieChartData, productPieChartData, ...lineChartData } = data
      this.setLineChartOptions(lineChartData)
      this.setLeadPieChartOptions(leadPieChartData)
      this.setProductPieChartOptions(productPieChartData)
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

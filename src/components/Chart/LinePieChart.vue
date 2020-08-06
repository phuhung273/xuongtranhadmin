<template>
  <div :style="{ width: width }">
    <!-- <resize-chart :key="dimension" :options="pieChartOptions" /> -->
    <resize-chart v-if="pieChartOptions" :options="pieChartOptions" />
    <resize-chart :options="lineChartOptions" height="400px" @mouseOver="handleMouseOver" />
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
  name: 'LinePieChart',
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
      pieChartOptions: undefined,
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
        const { pieChartData } = this.data
        this.setPieChartOptions(pieChartData, dimension)
        this.dimension = dimension
      }
    },
    setLineChartOptions(data) {
      const { series, legend } = this.parseLineData(data)

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
    setPieChartOptions(pieChartData, dimension) {
      const pieDimension = dimension + 1
      //   console.log(this.pieChartOptions)
      if (pieChartData !== undefined) {
        const itemName = pieChartData[0][0]
        this.pieChartOptions = {
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
      const { pieChartData, ...lineChartData } = data
      this.setLineChartOptions(lineChartData)
      this.setPieChartOptions(pieChartData, this.dimension)
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
  },
}
</script>

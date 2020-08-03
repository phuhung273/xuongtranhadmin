<template>
  <div :style="{ width: width }">
    <!-- <resize-chart :key="dimension" :options="pieChartOptions" /> -->
    <resize-chart v-if="pieChartOptions" :options="pieChartOptions" />
    <resize-chart
      :options="lineChartOptions"
      height="400px"
      @mouseOver="handleMouseOver"
    />
  </div>
</template>

<script>
import { marketingLeadOptions } from '@/settings'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import ResizeChart from './ResizeChart'

export default {
  name: 'LinePieChart',
  components: {
    ResizeChart
  },
  props: {
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '100%'
    },
    data: {
      type: Object,
      required: true
    },
    xAxis: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      lineChartOptions: undefined,
      pieChartOptions: undefined,
      dimension: 0
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
    // dimension: {
    //   handler(val) {
    //     this.setPieChartOptions(this.data, val)
    //   }
    // }
  },
  created() {
    this.setOptions(this.data)
  },
  methods: {
    handleMouseOver(event) {
      //   console.log(event.dataIndex)
      const dimension = event.dataIndex

      if (dimension !== this.dimension) {
        this.setPieChartOptions(this.data, dimension)
        this.dimension = dimension
      }
    },
    setLineChartOptions(data) {
      this.lineChartOptions = {
        title: {
          text: '',
          padding: [0, 5]
        },
        xAxis: {
          data: this.xAxis,
          boundaryGap: false,
          axisTick: {
            show: false
          }
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
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: marketingLeadOptions,
          icon: 'rect',
          itemGap: 20,
          left: '4%',
          textStyle: {
            fontSize: 14
          }
        },
        series: [
          {
            name: marketingLeadOptions[0],
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 5
                }
              }
            },
            smooth: true,
            type: 'line',
            data: data[marketingLeadOptions[0]],
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
            symbolSize: 20
          },
          {
            name: marketingLeadOptions[1],
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 5
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: data[marketingLeadOptions[1]],
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
            symbolSize: 20
          }
        ]
      }
    },
    setPieChartOptions({ pieChartData }, dimension) {
      const pieDimension = dimension + 1
      //   console.log(this.pieChartOptions)
      if (pieChartData !== undefined) {
        const itemName = pieChartData[0][0]
        this.pieChartOptions = {
          legend: {
            show: true
          },
          dataset: {
            source: pieChartData
          },
          series: [
            {
              type: 'pie',
              id: 'pie',
              radius: '50%',
              center: ['50%', '50%'],
              label: {
                formatter: '{b}: {@[' + pieDimension + ']} ({d}%)',
                fontSize: 16
              },
              encode: {
                //   itemName: this.getName(data),
                //   value: this.getValue(data),
                //   tooltip: this.getValue(data)
                itemName: itemName,
                value: pieDimension,
                tooltip: pieDimension
              }
            }
          ]
        }
      }
    },
    setOptions(data) {
      this.setLineChartOptions(data)
      this.setPieChartOptions(data, this.dimension)
    }
  }
}
</script>

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      labelOption: {
        show: true,
        position: 'inside'
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: 'Thống kê khách hàng từ Facebook'
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', 'Marketing', 'Sales'],
          source: [
            {
              product: '9/7/2020',
              Marketing: 43.3,
              Sales: 85.8
            },
            {
              product: '10/7/2020',
              Marketing: 86.4,
              Sales: 65.2
            },
            {
              product: '11/7/2020',
              Marketing: 72.4,
              Sales: 53.9
            }
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            label: this.labelOption
          },
          {
            type: 'bar',
            label: this.labelOption
          }
        ]
      })
    }
  }
}
</script>

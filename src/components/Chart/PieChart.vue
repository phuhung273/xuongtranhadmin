<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/utils/mixins/resize'

export default {
  name: 'PieChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '300px',
    },
    chartData: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      },
    },
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
    setOptions(data) {
      console.log(data)

      this.chart.setOption({
        legend: {
          show: false,
        },
        dataset: {
          // source: dataset,
          source: data,
        },
        series: [
          {
            type: 'pie',
            id: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            label: {
              formatter: '{b}: {@[' + 1 + ']} ({d}%)',
              fontSize: 16,
            },
            encode: {
              itemName: this.getName(data),
              value: this.getValue(data),
              tooltip: this.getValue(data),
            },
          },
        ],
      })
    },
    getName(data) {
      return data.length > 0 ? data[0][0] : ''
    },
    getValue(data) {
      return data.length > 0 ? data[0][1] : ''
    },
  },
}
</script>

<template>
  <v-chart
    :class="className"
    :options="options"
    :style="{ height: height, width: width }"
    @mouseover="handleMouseOver"
  />
</template>

<script>
import ECharts from 'vue-echarts'
import resize from '@/utils/mixins/resize'

export default {
  name: 'ResizeChart',
  components: {
    'v-chart': ECharts
  },
  mixins: [resize],
  props: {
    title: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // chart: undefined
    }
  },
  // watch: {
  //   chartData: {
  //     deep: true,
  //     handler(val) {
  //       this.setOptions(val)
  //     }
  //   }
  // },
  created() {
    // console.log(this.$el)
  },
  methods: {
    handleMouseOver(event) {
      this.$emit('mouseOver', event)
    }
  }
}
</script>

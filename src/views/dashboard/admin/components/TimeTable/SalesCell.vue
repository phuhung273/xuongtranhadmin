<template>
  <div class="inner-cell">
    <ul>
      <li v-for="status in list" :key="status.name">{{ status.name }}: {{ status.quantity }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      list: undefined
    }
  },
  created() {
    this.parseData()
    // console.log(this.list)
  },
  methods: {
    parseData() {
      //   console.log(this.data)
      const newList = []
      for (const status in this.data) {
        const newSource = { name: status, quantity: this.data[status] }
        newList.push(newSource)
      }

      this.list = newList
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-cell {
  ul {
    padding: 0 10px;
  }
}
</style>

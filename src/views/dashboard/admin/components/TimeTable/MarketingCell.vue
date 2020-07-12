<template>
  <div class="inner-cell">
    <ul v-for="source in list" :key="source.name">
      <div>{{ source.name }}</div>
      <li
        v-for="product in source.product"
        :key="product.name"
      >{{ product.name }}: {{ product.result }}</li>
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
      for (const source in this.data) {
        const newSource = { name: source, product: [] }
        for (const product in this.data[source]) {
          const newProduct = {
            name: product,
            result: this.data[source][product]
          }
          newSource.product.push(newProduct)
        }
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

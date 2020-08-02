<template>
  <div class="inner-cell">
    <ul v-for="product in list" :key="product.name">
      <div>{{ product.name }}</div>
      <li v-for="lead in product.lead" :key="lead.name">{{ lead.name }}: {{ lead.result }}</li>
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
      },
    },
  },
  data() {
    return {
      list: undefined,
    }
  },
  created() {
    this.parseData()
    // console.log(this.list)
  },
  methods: {
    parseData() {
      // console.log(this.data)
      const newList = []
      for (const product in this.data) {
        const newProduct = { name: product, lead: [] }

        for (const lead in this.data[product]) {
          const newLead = {
            name: lead,
            result: this.data[product][lead],
          }
          newProduct.lead.push(newLead)
        }
        newList.push(newProduct)
      }

      this.list = newList
      // console.log(newList)
    },
  },
}
</script>

<style lang="scss" scoped>
.inner-cell {
  ul {
    padding: 0 10px;
  }
}
</style>

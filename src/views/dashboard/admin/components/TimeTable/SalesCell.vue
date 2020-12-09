<template>
  <div class="inner-cell">
    <ul v-for="product in data.products" :key="product.product">
      <div>{{ product.product }}</div>
      <li v-for="lead in product.leads" :key="lead.lead">
        {{ lead.lead }}: {{ lead.result }}
      </li>
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

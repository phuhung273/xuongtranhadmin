<template>
  <div class="inner-cell">
    <ul>
      <li v-for="status in data.statuses" :key="status.status">
        {{ status.status }}: {{ status.result }}
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

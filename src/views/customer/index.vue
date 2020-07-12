<template>
  <div v-if="!listLoading" class="components-container board">
    <Kanban
      v-for="status in statusOptions"
      :key="status"
      :group="group"
      :header-text="status"
      class="kanban"
      :list="getListBasedOnStatus(status)"
    />
  </div>
</template>

<style lang="scss">
.board {
  margin-left: 20px;
  display: flex;
  //   justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
  overflow-x: scroll;
  background: #f0f0f0;
  height: calc(100vh - 110px);
}
.kanban {
  padding: 0 10px;
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

<script>
import Kanban from '@/components/Kanban'
import { fetchCustomerFunnel } from '@/api/customer'

export default {
  name: 'DragKanbanDemo',
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      list: null,
      listLoading: true,
      statusOptions: [
        'Hello',
        'Consulting',
        'Design Pick-up',
        'Contract Sent',
        '1st Deposit',
        'Production',
        'Fully Payment',
        'Lost'
      ],
      listQuery: {
        source: undefined
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      fetchCustomerFunnel(this.listQuery).then(response => {
        // console.log(response)
        this.list = this.prepareDraggableList(response.data.items)
        this.listLoading = false

        // console.log(this.list[this.statusOptions[0]])
      })
    },
    getListBasedOnStatus(status) {
      return this.list[status]
    },
    prepareDraggableList(items) {
      const newList = {}

      this.statusOptions.forEach(status => {
        const statusList = items.filter(item => item.status === status)

        newList[status] = statusList
      })

      return newList
    }
  }
}
</script>

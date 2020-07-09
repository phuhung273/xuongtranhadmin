<template>
  <div v-loading="listLoading" class="app-container">
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
import { fetchCustomerFunnel, updateCustomerFunnel } from '@/api/customer'

const intlDateObj = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Ho_Chi_Minh'
})

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
    async getData() {
      fetchCustomerFunnel(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.items
        this.listLoading = false

        // console.log(this.list)
      })
    },
    getListBasedOnStatus(status) {
      //   console.log(status)
      return this.list.filter(customer => customer.status === status)
    }
  }
}
</script>

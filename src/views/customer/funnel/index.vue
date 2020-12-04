<template>
  <div v-if="!listLoading" class="components-container board">
    <Kanban
      v-for="status_name in statusObjects"
      :key="status_name.name + status_name.componentKey"
      :group="group"
      :header-text="status_name.name"
      class="kanban"
      :list="getListBasedOnStatus(status_name.name)"
      @openForm="openForm"
      @updateColumn="handleModifiedTimeUpdate"
    />

    <CustomerForm
      title="Chỉnh Sửa Khách Hàng"
      :visible="dialogFormVisible"
      :loading="dialogFormLoading"
      :data="temp"
      :temp-status="tempStatus"
      method="update"
      @closeForm="closeForm"
      @submit="handleSubmit"
      @beforeSubmit="handleBeforeSubmit"
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
import CustomerForm from '@/components/CustomerForm'
import { fetchCustomerFunnel, fetchOneCustomer } from '@/api/customer'

export default {
  name: 'DragKanbanDemo',
  components: {
    Kanban,
    CustomerForm,
  },
  data() {
    return {
      group: 'mission',
      list: null,
      listLoading: true,
      statusObjects: [
        {
          name: 'Hello',
          componentKey: 0,
        },
        {
          name: 'Consulting',
          componentKey: 0,
        },
        {
          name: 'Design Pick-up',
          componentKey: 0,
        },
        {
          name: 'Contract Sent',
          componentKey: 0,
        },
        {
          name: '1st Deposit',
          componentKey: 0,
        },
        {
          name: 'Production',
          componentKey: 0,
        },
        {
          name: 'Fully Payment',
          componentKey: 0,
        },
        {
          name: 'Lost',
          componentKey: 0,
        },
      ],
      listQuery: {
        source: undefined,
      },
      dialogFormVisible: false,
      dialogFormLoading: false,
      temp: {
        id: undefined,
        customer: undefined,
        sale_lead_name: undefined,
        demand: undefined,
        connection: undefined,
        status_name: undefined,
        email: undefined,
        phone: undefined,
        product_name: undefined,
        time: undefined,
        modified_time: undefined,
      },
      tempStatus: undefined,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      fetchCustomerFunnel(this.listQuery).then((response) => {
        // console.log(response)
        this.list = this.prepareDraggableList(response.data.items)
        this.listLoading = false

        // console.log(this.list[this.statusObjects[0]])
      })
    },
    getListBasedOnStatus(status_name) {
      return this.list[status_name]
    },
    prepareDraggableList(items) {
      const newList = {}

      this.statusObjects.forEach((status_name) => {
        const statusList = items.filter((item) => item.status_name === status_name.name)

        newList[status_name.name] = statusList
      })

      return newList
    },
    openForm(id) {
      this.resetTemp()
      // console.log(id)
      this.dialogFormVisible = true
      this.dialogFormLoading = true

      fetchOneCustomer(id).then((response) => {
        // console.log(response)
        // setTimeout(() => {
        //   this.temp = response.data.items[0]
        //   this.dialogFormLoading = false
        // }, 1000)
        this.temp = response.data.items[0]
        this.dialogFormLoading = false
        this.tempStatus = this.temp.status_name
      })
    },
    closeForm() {
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        customer: undefined,
        sale_lead_name: undefined,
        demand: undefined,
        connection: undefined,
        status_name: undefined,
        email: undefined,
        phone: undefined,
        product_name: undefined,
        time: undefined,
        modified_time: undefined,
      }
    },
    handleBeforeSubmit() {
      this.dialogFormLoading = true
    },
    handleSubmit(submitItem) {
      // console.log(this.temp)
      // console.log(this.list)
      // console.log(this.statusObjects)
      // console.log(submitItem)

      const newList = { ...this.list }
      if (this.temp.status_name === this.tempStatus) {
        let oldStatusList = [...this.list[this.temp.status_name]]
        oldStatusList = oldStatusList.map((item) => {
          return item.id === this.temp.id ? this.temp : item
        })

        newList[this.tempStatus] = oldStatusList
      } else {
        let oldStatusList = [...this.list[this.tempStatus]]
        oldStatusList = oldStatusList.filter((item) => item.id !== this.temp.id)
        // console.log(oldStatusList)
        newList[this.tempStatus] = oldStatusList
        // console.log(newList)

        const newStatusList = [...this.list[this.temp.status_name]]

        const { newItem } = submitItem
        this.temp.modified_time = newItem.modified_time
        newStatusList.unshift(this.temp)
        newList[this.temp.status_name] = newStatusList
      }

      // console.log(this.temp.status_name)
      // console.log(this.tempStatus)
      this.list = { ...newList }

      // // Change key to rerender
      // const newStatusObjects = this.statusObjects.map((status_name) => {
      //   if (
      //     status_name.name === this.temp.status_name ||
      //     status_name.name === this.tempStatus
      //   ) {
      //     return {
      //       name: status_name.name,
      //       componentKey: status_name.componentKey + 1,
      //     }
      //   }

      //   return status_name
      // })

      // this.statusObjects = [...newStatusObjects]

      this.reRenderStatuses([this.tempStatus, this.temp.status_name])

      this.dialogFormVisible = false
      this.dialogFormLoading = false
      // this.list = { ...this.list }
    },
    handleModifiedTimeUpdate({ listName, newItem }) {
      // console.log(newItem)
      // console.log(listName)

      const { id, modified_time } = newItem
      const modifiedList = this.list[listName].map((item) => {
        if (item.id === id) {
          const newItem = { ...item }
          newItem.modified_time = modified_time
          return newItem
        }

        return item
      })

      this.list[listName] = modifiedList

      this.reRenderStatus(listName)
    },
    reRenderStatus(statusName) {
      // Change key to rerender
      const newStatusObjects = this.statusObjects.map((status_name) => {
        if (status_name.name === statusName) {
          return {
            name: status_name.name,
            componentKey: status_name.componentKey + 1,
          }
        }

        return status_name
      })

      this.statusObjects = [...newStatusObjects]
      // console.log(this.statusObjects)
    },
    reRenderStatuses(statusList) {
      statusList.forEach((status_name) => {
        this.reRenderStatus(status_name)
      })
    },
  },
}
</script>

<template>
  <div class="board-column">
    <div class="board-column-header">{{ headerText }}</div>

    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      @change="changeHandle"
    >
      <div
        v-for="element in list"
        :key="element.id"
        :options="{handle:'.drag-this'}"
        class="board-item"
      >
        <div class="board-item-customer">{{ element.customer }}</div>
        <div class="board-item-time">Tương tác cuối: {{ element.time | parseHCMDate }}</div>
        <div class="board-item-footer">
          <div class="action">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="small"
              circle
              @click="handleEdit(element.id)"
            />
          </div>
          <div class="staff-avatar">
            <el-tooltip effect="dark" :content="element.customer" placement="bottom">
              <el-avatar size="medium">{{ element.customer }}</el-avatar>
            </el-tooltip>
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { updateCustomerFunnel } from '@/api/customer'
import { parseHCMDate } from '@/utils/time'
import { fetchCustomerFunnel } from '@/api/customer'

export default {
  name: 'DragKanbanDemo',
  components: {
    draggable,
  },
  filters: {
    parseHCMDate,
  },
  props: {
    headerText: {
      type: String,
      default: 'Header',
    },
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },

  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    changeHandle(event) {
      const isElementAdded = event.added !== undefined

      if (isElementAdded) {
        const { id } = event.added.element
        const info = { id: id, status: this.headerText }
        updateCustomerFunnel(info).catch((error) => {
          console.log(error)
        })
      }
    },
    handleEdit(id) {
      // console.log(id)
      this.$emit('openForm', id)
    },
  },
}
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 300px;
  min-height: 100px;
  // height: auto;
  // height: 100%;
  // overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    // height: auto;
    height: 100%;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: grab;
      width: 100%;
      // height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      // line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);

      .board-item-customer,
      .board-item-time {
        height: 30px;
        display: flex;
        align-items: center;
      }

      .board-item-customer {
        font-size: 16px;
      }

      .board-item-time {
        font-size: 14px;
      }

      .board-item-footer {
        .action {
          float: left;
        }
        .staff-avatar {
          float: right;
        }
      }
    }
  }
}
</style>

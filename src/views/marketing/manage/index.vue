<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.title"
        placeholder="Title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />-->
      <el-select
        v-model="listQuery.source"
        placeholder="Nguồn"
        clearable
        style="width: 140px"
        class="filter-item"
      >
        <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >Tìm Kiếm</el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Thêm Task</el-button>

      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >Xuất Excel</el-button>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Ngày" width="200px" align="center">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <!-- <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span class="link-type" @click="handleUpdate(row)">{{ row.time | parseHCMDate }}</span>
          <!-- <span>{{ row.time }}</span> -->
        </template>
      </el-table-column>

      <el-table-column label="Nguồn" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Sản Phẩm" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.product }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Loại Lead" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lead }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Kết Quả" width="80px" align="center">
        <template slot-scope="{ row }">
          <!-- <svg-icon
            v-for="n in + row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />-->
          {{ row.result }}
        </template>
      </el-table-column>

      <el-table-column label="Nội Dung" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        v-if="showReviewer"
        label="Reviewer"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>-->

      <!-- <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{ row }">
          <span
            v-if="row.pageviews"
            class="link-type"
            @click="handleFetchPv(row.pageviews)"
            >{{ row.pageviews }}</span
          >
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column
        label="Chỉnh Sửa"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Chỉnh Sửa</el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >Xoá</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-loading="dialogFormLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Nguồn" prop="source">
          <el-select v-model="temp.source" class="filter-item" placeholder="Chọn nguồn">
            <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Sản Phẩm" prop="product">
          <el-select v-model="temp.product" class="filter-item" placeholder="Chọn sản phẩm">
            <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Loại Lead" prop="lead">
          <el-select v-model="temp.lead" class="filter-item" placeholder="Chọn sản phẩm">
            <el-option v-for="item in leadOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Kết Quả" prop="result">
          <el-input v-model="temp.result" type="number" />
        </el-form-item>

        <el-form-item label="Thời Gian" prop="time">
          <!-- <el-date-picker v-model="temp.time" type="datetime" placeholder="Chọn ngày" /> -->
          <el-date-picker v-model="temp.time" placeholder="Chọn ngày" />
        </el-form-item>

        <el-form-item label="Nội Dung">
          <el-input
            v-model="temp.content"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Nhập nội dung"
          />
        </el-form-item>

        <!-- <el-form-item label="Imp">
          <el-rate
            v-model="temp.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"
          />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Huỷ</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >Xác Nhận</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-loading="dialogDeleteLoading"
      title="Xác Nhận Xoá"
      :visible.sync="dialogDeleteVisible"
      width="30%"
    >
      <span>Bạn có chắc muốn xoá dữ liệu này</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">Đóng</el-button>
        <el-button type="danger" @click="deleteData()">Xoá</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import {
  fetchMarketingList,
  createMarketingTask,
  updateMarketingTask,
  deleteMarketingTask,
} from '@/api/marketing'
import { fillFormObject } from '@/utils/form'
import waves from '@/directive/waves' // waves directive

import { parseHCMDate } from '@/utils/time'

export default {
  name: 'ComplexTable',
  components: {},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
    parseHCMDate,
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        source: undefined,
      },
      sourceOptions: ['Facebook', 'SEM'],
      productOptions: ['Tranh Canvas', 'Tranh vẽ tường'],
      leadOptions: ['Facebook inbox', 'Call'],
      temp: {
        id: undefined,
        source: undefined,
        product: undefined,
        content: undefined,
        time: undefined,
        result: undefined,
        lead: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Chỉnh Sửa',
        create: 'Thêm Task',
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        source: [
          { required: true, message: 'Vui lòng nhập nguồn', trigger: 'change' },
        ],
        time: [
          {
            type: 'date',
            required: true,
            message: 'Vui lòng nhập ngày',
            trigger: 'change',
          },
        ],
        product: [
          {
            required: true,
            message: 'Vui lòng nhập sản phẩm',
            trigger: 'blur',
          },
        ],
        result: [
          { required: true, message: 'Vui lòng nhập số', trigger: 'blur' },
        ],
      },
      downloadLoading: false,
      dialogFormLoading: false,
      dialogDeleteVisible: false,
      dialogDeleteLoading: false,
      tempDeleteIndex: undefined,
      tempDeleteId: undefined,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.items
      //     this.total = response.data.total

      //     // Just to simulate the time of the request
      //     setTimeout(() => {
      //       this.listLoading = false
      //     }, 1.5 * 1000)
      //   })

      fetchMarketingList(this.listQuery).then((response) => {
        // console.log(response)
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false

        // console.log(this.list)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        source: undefined,
        product: undefined,
        content: undefined,
        time: undefined,
        result: undefined,
        lead: undefined,
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          fillFormObject(this.temp)
          // console.log(this.temp)
          this.dialogFormLoading = true

          // setTimeout(() => {
          //   createMarketingTask(this.temp).then(() => {
          //     this.list.unshift(this.temp)
          //     this.dialogFormVisible = false
          //     this.dialogFormLoading = false
          //     this.$notify({
          //       title: 'Thành Công',
          //       message: 'Thêm thành công',
          //       type: 'success',
          //       duration: 2000
          //     })
          //   })
          // }, 1000)

          createMarketingTask(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.dialogFormLoading = false

            this.$notify({
              title: 'Thành Công',
              message: 'Thêm thành công',
              type: 'success',
              duration: 2000,
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.time = new Date(this.temp.time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)

          fillFormObject(tempData)
          this.dialogFormLoading = true

          updateMarketingTask(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormLoading = false
            this.dialogFormVisible = false

            this.$notify({
              title: 'Thành Công',
              message: 'Chỉnh sửa thành công',
              type: 'success',
              duration: 2000,
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.tempDeleteId = row.id
      this.dialogDeleteVisible = true
      this.tempDeleteIndex = index
    },
    deleteData() {
      this.dialogDeleteLoading = true

      deleteMarketingTask({ id: this.tempDeleteId }).then(() => {
        this.list.splice(this.tempDeleteIndex, 1)
        this.dialogDeleteLoading = false
        this.dialogDeleteVisible = false

        this.$notify({
          title: 'Thành Công',
          message: 'Xoá thành công',
          type: 'success',
          duration: 2000,
        })
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
  },
}
</script>

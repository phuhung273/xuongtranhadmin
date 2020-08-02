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
        v-model="listQuery.lead"
        placeholder="Loại Lead"
        clearable
        style="width: 140px"
        class="filter-item"
      >
        <el-option v-for="item in leadOptions" :key="item" :label="item" :value="item" />
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
      >Thêm Khách Hàng</el-button>

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
      <el-table-column label="Ngày" width="150px" align="center">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <!-- <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span class="link-type" @click="handleUpdate(row)">{{ row.time | parseHCMDate }}</span>
          <!-- <span>{{ row.time }}</span> -->
        </template>
      </el-table-column>

      <el-table-column label="Khách Hàng" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.customer }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Loại Lead" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lead }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Sản Phẩm" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.product }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Nhu Cầu Cụ Thể" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.demand }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Tương Tác" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.connection }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Chốt Deal" class-name="status-col" width="150px">
        <template slot-scope="{ row }">{{ row.status }}</template>
      </el-table-column>

      <el-table-column label="Email" width="150px">
        <template slot-scope="{ row }">{{ row.email }}</template>
      </el-table-column>

      <el-table-column label="Điện Thoại" width="150px">
        <template slot-scope="{ row }">{{ row.phone }}</template>
      </el-table-column>

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

    <!-- <el-dialog
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
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Khách Hàng" prop="customer">
          <el-input v-model="temp.customer" placeholder="Tên khách hàng" />
        </el-form-item>

        <el-form-item label="Loại Lead" prop="lead">
          <el-select v-model="temp.lead" class="filter-item" placeholder="Chọn loại Lead">
            <el-option v-for="item in leadOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Sản Phẩm" prop="product">
          <el-select v-model="temp.product" class="filter-item" placeholder="Chọn sản phẩm">
            <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Nhu Cầu Cụ Thể" prop="demand">
          <el-input v-model="temp.demand" />
        </el-form-item>

        <el-form-item label="Tương Tác" prop="connection">
          <el-input
            v-model="temp.connection"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Nội dung tương tác"
          />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item label="Điện Thoại" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>

        <el-form-item label="Thời Gian" prop="time">
          <el-date-picker v-model="temp.time" placeholder="Chọn ngày" />
        </el-form-item>

        <el-form-item label="Chốt Deal" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Tình trạng deal">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Huỷ</el-button>

        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >Xác Nhận</el-button>
      </div>
    </el-dialog>-->

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

    <CustomerForm
      :title="textMap[dialogStatus]"
      :visible="dialogFormVisible"
      :loading="dialogFormLoading"
      :data="temp"
      :method="dialogStatus"
      @closeForm="closeForm"
      @submit="handleSubmit"
      @beforeSubmit="handleBeforeSubmit"
    />
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'

import {
  fetchCustomerList,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/api/sales'

import { fillFormObject } from '@/utils/form'
import waves from '@/directive/waves' // waves directive
import { parseHCMDate } from '@/utils/time'
import CustomerForm from '@/components/CustomerForm'

export default {
  name: 'ComplexTable',
  components: { CustomerForm },
  directives: { waves },
  filters: {
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
        lead: undefined,
      },
      leadOptions: ['Facebook inbox', 'Hotline call', 'Zalo call/inbox'],
      productOptions: ['Tranh Canvas', 'Tranh vẽ tường'],
      statusOptions: [
        'Hello',
        'Consulting',
        'Design Pick-up',
        'Contract Sent',
        '1st Deposit',
        'Production',
        'Fully Payment',
        'Lost',
      ],
      temp: {
        id: undefined,
        customer: undefined,
        lead: undefined,
        demand: undefined,
        connection: undefined,
        status: undefined,
        email: undefined,
        phone: undefined,
        product: undefined,
        time: undefined,
      },
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogStatus: '',
      textMap: {
        update: 'Chỉnh Sửa',
        create: 'Thêm Khách Hàng',
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        lead: [
          {
            required: true,
            message: 'Vui lòng nhập loại Lead',
            trigger: 'change',
          },
        ],
        time: [
          {
            type: 'date',
            required: true,
            message: 'Vui lòng nhập ngày',
            trigger: 'change',
          },
        ],
        connection: [
          {
            required: true,
            message: 'Vui lòng nhập tương tác',
            trigger: 'change',
          },
        ],
        customer: [
          {
            required: true,
            message: 'Vui lòng nhập khách hàng',
            trigger: 'change',
          },
        ],
      },
      downloadLoading: false,
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

      // console.log(this.listQuery)

      fetchCustomerList(this.listQuery).then((response) => {
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
    openForm() {
      this.dialogFormVisible = true
    },
    closeForm() {
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        customer: undefined,
        lead: undefined,
        demand: undefined,
        connection: undefined,
        status: undefined,
        email: undefined,
        phone: undefined,
        product: undefined,
        time: undefined,
      }
    },
    handleBeforeSubmit() {
      this.dialogFormLoading = true
    },
    handleSubmit(newData) {
      if (this.dialogStatus === 'create') {
        this.createData(newData)
      } else if (this.dialogStatus === 'update') {
        this.updateData()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'

      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })

      this.openForm()
    },
    createData(newData) {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     fillFormObject(this.temp)
      //     // console.log(this.temp)
      //     this.dialogFormLoading = true

      //     createCustomer(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.dialogFormLoading = false

      //       this.$notify({
      //         title: 'Thành Công',
      //         message: 'Thêm thành công',
      //         type: 'success',
      //         duration: 2000,
      //       })
      //     })
      //   }
      // })
      this.temp = { ...newData }
      this.list.unshift(this.temp)
      this.dialogFormVisible = false
      this.dialogFormLoading = false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // console.log(row)
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'

      // this.temp.time = new Date(this.temp.time)
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
      this.openForm()
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp)
      //     fillFormObject(tempData)
      //     this.dialogFormLoading = true
      //     updateCustomer(tempData).then(() => {
      //       const index = this.list.findIndex((v) => v.id === this.temp.id)
      //       this.list.splice(index, 1, this.temp)
      //       this.dialogFormLoading = false
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: 'Thành Công',
      //         message: 'Chỉnh sửa thành công',
      //         type: 'success',
      //         duration: 2000,
      //       })
      //     })
      //   }
      // })
      const index = this.list.findIndex((v) => v.id === this.temp.id)
      this.list.splice(index, 1, this.temp)
      this.dialogFormLoading = false
      this.dialogFormVisible = false
    },
    handleDelete(row, index) {
      this.tempDeleteId = row.id
      this.dialogDeleteVisible = true
      this.tempDeleteIndex = index
    },
    deleteData() {
      this.dialogDeleteLoading = true

      deleteCustomer({ id: this.tempDeleteId }).then(() => {
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

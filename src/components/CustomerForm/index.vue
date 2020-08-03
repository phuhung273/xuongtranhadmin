<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :title="title"
    :visible="visible"
    width="1000px"
    @close="handleClose"
    @open="handleOpen"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="150px"
      class="dialog-form"
      :inline="true"
    >
      <el-form-item label="Khách Hàng" prop="customer" class="dialog-form-item">
        <el-input v-model="data.customer" placeholder="Tên khách hàng" class="dialog-form-field" />
      </el-form-item>

      <el-form-item label="Loại Lead" prop="lead" class="dialog-form-item">
        <el-select
          v-model="data.lead"
          class="filter-item dialog-form-field"
          placeholder="Chọn loại Lead"
        >
          <el-option v-for="item in leadOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="Sản Phẩm" prop="product" class="dialog-form-item">
        <el-select
          v-model="data.product"
          class="filter-item dialog-form-field"
          placeholder="Chọn sản phẩm"
        >
          <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="Nhu Cầu Cụ Thể" prop="demand" class="dialog-form-item">
        <el-input v-model="data.demand" class="dialog-form-field" />
      </el-form-item>

      <el-row>
        <el-form-item label="Tương Tác" prop="connection">
          <el-input
            v-model="data.connection"
            :autosize="{ minRows: 2, maxRows: 3 }"
            type="textarea"
            placeholder="Nội dung tương tác"
            class="dialog-form-textarea"
          />
        </el-form-item>
      </el-row>

      <el-form-item label="Email" prop="email" class="dialog-form-item">
        <el-input v-model="data.email" class="dialog-form-field" />
      </el-form-item>

      <el-form-item label="Điện Thoại" prop="phone" class="dialog-form-item">
        <el-input v-model="data.phone" class="dialog-form-field" />
      </el-form-item>

      <el-form-item label="Thời Gian" prop="time" class="dialog-form-item">
        <!-- <el-date-picker v-model="data.time" type="datetime" placeholder="Chọn ngày" /> -->
        <el-date-picker v-model="data.time" placeholder="Chọn ngày" class="dialog-form-field" />
      </el-form-item>

      <el-form-item label="Chốt Deal" prop="status" class="dialog-form-item">
        <el-select
          v-model="data.status"
          class="filter-item dialog-form-field"
          placeholder="Tình trạng deal"
        >
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Huỷ</el-button>

      <el-button type="primary" @click="handleSubmit">Xác Nhận</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createCustomer, updateCustomer } from '@/api/sales'
import { fillFormObject } from '@/utils/form'
import { parseHCMDate } from '@/utils/time'
import { salesLeadOptions, productOptions, statusOptions } from '@/settings'

export default {
  name: 'CustomerForm',
  filters: {
    parseHCMDate,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: undefined,
    },
    method: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // leadOptions: ['Facebook inbox', 'Hotline call', 'Zalo call/inbox'],
      // productOptions: ['Tranh Canvas', 'Tranh vẽ tường'],
      // statusOptions: [
      //   'Hello',
      //   'Consulting',
      //   'Design Pick-up',
      //   'Contract Sent',
      //   '1st Deposit',
      //   'Production',
      //   'Fully Payment',
      //   'Lost',
      // ],
      leadOptions: salesLeadOptions,
      productOptions: productOptions,
      statusOptions: statusOptions,
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
            // type: 'date',
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
    }
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit('closeForm')
    },
    handleOpen() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSubmit() {
      this.$emit('beforeSubmit')

      if (this.method === 'update') {
        this.updateData()
          .then((newData) => {
            this.$emit('submit', newData)
          })
          .catch((error) => {
            // console.log(error)
          })
      } else if (this.method === 'create') {
        this.createData()
          .then((newData) => {
            this.$emit('submit', newData)
          })
          .catch((error) => {
            // console.log(error)
          })
      }
    },
    updateData() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.data)

            fillFormObject(tempData)

            // setTimeout(() => {
            //   updateCustomer(tempData)
            //     .then(() => {
            //       this.$notify({
            //         title: 'Thành Công',
            //         message: 'Chỉnh sửa thành công',
            //         type: 'success',
            //         duration: 2000,
            //       })

            //       resolve()
            //     })
            //     .catch((error) => {
            //       // console.log(error)
            //       reject()
            //     })
            // }, 2000)

            updateCustomer(tempData)
              .then(() => {
                this.$notify({
                  title: 'Thành Công',
                  message: 'Chỉnh sửa thành công',
                  type: 'success',
                  duration: 2000,
                })

                resolve()
              })
              .catch((error) => {
                // console.log(error)
                reject()
              })
          } else {
            reject()
          }
        })
      })
    },
    createData() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.data)

            fillFormObject(tempData)

            // setTimeout(() => {
            //   createCustomer(tempData)
            //     .then(() => {
            //       this.$notify({
            //         title: 'Thành Công',
            //         message: 'Thêm thành công',
            //         type: 'success',
            //         duration: 2000,
            //       })

            //       resolve(tempData)
            //     })
            //     .catch((error) => {
            //       console.log(error)
            //       reject()
            //     })
            // }, 2000)

            createCustomer(tempData)
              .then((response) => {
                this.$notify({
                  title: 'Thành Công',
                  message: 'Thêm thành công',
                  type: 'success',
                  duration: 2000,
                })
                // console.log(response)
                tempData.id = response.data.insertId
                resolve(tempData)
              })
              .catch((error) => {
                console.log(error)
                reject()
              })
          } else {
            reject()
          }
        })
      })
    },
  },
}
</script>

<style lang="scss">
.dialog-form {
  // width: 700px;
  margin-left: 50px;

  .dialog-form-item {
    width: 400px;
  }

  .dialog-form-field {
    width: 200px;
  }

  .dialog-form-textarea {
    width: 400px;
  }
}
</style>

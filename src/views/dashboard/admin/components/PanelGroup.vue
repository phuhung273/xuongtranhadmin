<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Khách Hàng</div>
          <count-to :start-val="0" :end-val="customer" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <!-- <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>-->
        <div class="card-panel-icon-wrapper icon-el-icon-question">
          <i class="el-icon-question card-panel-icon" />
          <!-- <svg-icon icon-class="el-icon-phone" class-name="card-panel-icon" /> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Hello</div>
          <count-to :start-val="0" :end-val="hello" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-skill">
          <svg-icon icon-class="skill" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Design Pick-up</div>
          <count-to :start-val="0" :end-val="design" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <!-- <div class="card-panel-icon-wrapper icon-shopping"> -->
        <div class="card-panel-icon-wrapper icon-guide">
          <svg-icon icon-class="guide" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Contract Sent</div>
          <count-to :start-val="0" :end-val="contract" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo,
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      customers: [],
    }
  },
  computed: {
    customer() {
      return this.customers.reduce((prev, next) => {
        let sum = prev
        for (const status in next) {
          sum += next[status]
        }
        return sum
      }, 0)
    },
    hello() {
      return this.countStatus('Hello')
    },
    design() {
      return this.countStatus('Design Pick-up')
    },
    contract() {
      return this.countStatus('Contract Sent')
    },
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        this.setCustomers(val)
      },
    },
  },
  methods: {
    setCustomers(list) {
      // console.log(this.list)
      this.customers = this.list.map((item) => item.customer)
    },
    countStatus(statusName) {
      return this.customers.reduce((prev, next) => {
        const result = next[statusName]
        return result ? prev + result : prev
      }, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-el-icon-question {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }

      .icon-skill {
        background: #f4516c;
      }

      .icon-guide {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-el-icon-question {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .icon-skill {
      color: #f4516c;
    }

    .icon-guide {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

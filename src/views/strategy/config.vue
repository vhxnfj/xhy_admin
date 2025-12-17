<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="listQuery.keyword" placeholder="关键词" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="toolbar-box" style="margin-bottom: 20px;">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加策略</el-button>
      <!-- <el-button type="danger" icon="el-icon-delete" :disabled="selectedList.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
       <el-button type="success" icon="el-icon-open" :disabled="selectedList.length === 0"
         @click="handleBatchToggle(true)">
          批量启用
        </el-button>
       <el-button type="warning" icon="el-icon-turn-off" :disabled="selectedList.length === 0"
         @click="handleBatchToggle(false)">
          批量禁用
       </el-button> -->
    </div>

    <el-table v-loading="loading" :data="list" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column prop="id" label="ID" width="80" align="center" /> -->
      <el-table-column prop="coin_name" label="币种" width="120" align="center" />
      <el-table-column prop="total_addition_amount" label="补单金额" width="120" align="center" />
      <!-- <el-table-column prop="total_addition_times" label="补单次数" width="100" align="center" /> -->
      <!-- <el-table-column prop="deadline_time_minutes" label="截止时间(分)" width="120" align="center" /> -->
      <el-table-column label="补仓时间" width="280" align="center">
        <template slot-scope="{row}">
          {{ row.addition_start_time }} - {{ row.addition_end_time }}
        </template>
      </el-table-column>
      <el-table-column label="建仓时间" width="280" align="center">
        <template slot-scope="{row}">
          {{ row.buy_start_time }} - {{ row.buy_end_time }}
        </template>
      </el-table-column>
      <el-table-column label="方向" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.side === 'long' ? 'success' : 'danger'">
            {{ row.side === 'long' ? '买入' : '卖出' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="leverage" label="杠杆倍数" width="100" align="center" />
      <el-table-column label="买入量(min/max)" width="150" align="center">
        <template slot-scope="{row}">
          {{ row.buy_amount_min }} / {{ row.buy_amount_max }}
        </template>
      </el-table-column>
      <el-table-column label="止盈点(min/max)" width="150" align="center">
        <template slot-scope="{row}">
          {{ row.profit_point_min }}% / {{ row.profit_point_max }}%
        </template>
      </el-table-column>
      <el-table-column label="止损点(min/max)" width="150" align="center">
        <template slot-scope="{row}">
          {{ row.loss_point_min }}% / {{ row.loss_point_max }}%
        </template>
      </el-table-column>
      <el-table-column prop="fee_rate" label="手续费率" width="100" align="center">
        <template slot-scope="{row}">
          {{ row.fee_rate }}%
        </template>
      </el-table-column>
      <el-table-column label="盈利状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.is_profit" :active-value="1" :inactive-value="0" @change="handleProfitChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" />
      <el-table-column label="操作" width="260" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleExecuteProfit(row)">执行收益</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box" style="margin-top: 20px; text-align: right;">
      <el-pagination background :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100]"
        :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px"
        style="margin-left:50px;">
        <el-form-item label="币种" prop="coin_id">
          <el-select v-model="temp.coin_id" placeholder="请选择币种" style="width: 100%;">
            <el-option v-for="item in coinOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="补单金额" prop="total_addition_amount">
          <el-input v-model="temp.total_addition_amount" type="number" style="width: 100%;" />
        </el-form-item>
        <!-- <el-form-item label="补单次数" prop="total_addition_times">
          <el-input v-model="temp.total_addition_times" type="number" />
        </el-form-item>
        <el-form-item label="截止时间(分)" prop="deadline_time_minutes">
          <el-input v-model="temp.deadline_time_minutes" type="number" />
        </el-form-item> -->
        <el-form-item label="补仓时间" prop="addition_time_range">
          <el-date-picker v-model="temp.addition_time_range" type="datetimerange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="建仓时间" prop="buy_time_range">
          <el-date-picker v-model="temp.buy_time_range" type="datetimerange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="方向" prop="side">
          <el-radio-group v-model="temp.side">
            <el-radio label="long">买入</el-radio>
            <el-radio label="short">卖出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="杠杆倍数" prop="leverage">
          <el-input v-model="temp.leverage" type="number" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="买入量">
          <el-col :span="11">
            <el-form-item prop="buy_amount_min">
              <el-input v-model="temp.buy_amount_min" type="number" placeholder="最小买入量" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="buy_amount_max">
              <el-input v-model="temp.buy_amount_max" type="number" placeholder="最大买入量" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="止盈点">
          <el-col :span="11">
            <el-form-item prop="profit_point_min">
              <el-input v-model="temp.profit_point_min" type="number" placeholder="最小止盈点" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="profit_point_max">
              <el-input v-model="temp.profit_point_max" type="number" placeholder="最大止盈点" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="止损点">
          <el-col :span="11">
            <el-form-item prop="loss_point_min">
              <el-input v-model="temp.loss_point_min" type="number" placeholder="最小止损点" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="loss_point_max">
              <el-input v-model="temp.loss_point_max" type="number" placeholder="最大止损点" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="手续费率" prop="fee_rate">
          <el-input v-model="temp.fee_rate" type="number" style="width: 100%;">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="盈利状态" prop="is_profit">
          <el-switch v-model="temp.is_profit" :active-value="1" :inactive-value="0" active-color="#13ce66" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStrategyConfigList,
  getStrategyConfigCoinOptions,
  addStrategyConfig,
  updateStrategyConfig,
  deleteStrategyConfig,
  setStrategyConfigProfit,
  batchDeleteStrategyConfig,
  toggleStrategyConfigStatus,
  batchToggleStrategyConfigStatus,
  executeStrategyProfit
} from '@/api/strategy'

export default {
  name: 'StrategyConfig',
  data() {
    return {
      list: [],
      total: 0,
      loading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        keyword: ''
      },
      coinOptions: [],
      selectedList: [],
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      temp: {
        id: undefined,
        coin_id: undefined,
        total_addition_amount: 0,
        total_addition_times: 0,
        deadline_time_minutes: 0,
        addition_start_time: '',
        addition_end_time: '',
        addition_time_range: [],
        buy_amount_min: 0,
        buy_amount_max: 0,
        profit_point_min: 0,
        profit_point_max: 0,
        loss_point_min: 0,
        loss_point_max: 0,
        fee_rate: 0,
        status: 1,
        is_profit: 0,
        buy_start_time: '',
        buy_end_time: '',
        side: 'long',
        leverage: 1
      },
      rules: {
        coin_id: [{ required: true, message: '请选择币种', trigger: 'change' }],
        total_addition_amount: [{ required: true, message: '请输入补单总金额', trigger: 'blur' }],
        total_addition_times: [{ required: true, message: '请输入补单总次数', trigger: 'blur' }],
        deadline_time_minutes: [{ required: true, message: '请输入截止时间(分钟)', trigger: 'blur' }],
        addition_time_range: [{ required: true, message: '请选择补仓时间', trigger: 'change' }],
        buy_time_range: [{ required: true, message: '请选择买入时间', trigger: 'change' }],
        side: [{ required: true, message: '请选择方向', trigger: 'change' }],
        leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }],
        buy_amount_min: [{ required: true, message: '请输入最小买入量', trigger: 'blur' }],
        buy_amount_max: [{ required: true, message: '请输入最大买入量', trigger: 'blur' }],
        profit_point_min: [{ required: true, message: '请输入最小止盈点', trigger: 'blur' }],
        profit_point_max: [{ required: true, message: '请输入最大止盈点', trigger: 'blur' }],
        loss_point_min: [{ required: true, message: '请输入最小止损点', trigger: 'blur' }],
        loss_point_max: [{ required: true, message: '请输入最大止损点', trigger: 'blur' }],
        fee_rate: [{ required: true, message: '请输入费率', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getCoinOptions()
  },
  methods: {
    handleExecuteProfit(row) {
      this.$confirm('确认执行收益?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        executeStrategyProfit(row.id).then(() => {
          this.$message.success('执行收益成功')
          this.getList()
        })
      })
    },
    getList() {
      this.loading = true
      getStrategyConfigList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getCoinOptions() {
      getStrategyConfigCoinOptions().then(response => {
        this.coinOptions = response.data
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pagesize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectedList = val.map(item => item.id)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        coin_id: undefined,
        total_addition_amount: 0,
        total_addition_times: 0,
        deadline_time_minutes: 0,
        addition_start_time: '',
        addition_end_time: '',
        addition_time_range: [],
        buy_amount_min: 0,
        buy_amount_max: 0,
        profit_point_min: 0,
        profit_point_max: 0,
        loss_point_min: 0,
        loss_point_max: 0,
        fee_rate: 0,
        status: 1,
        is_profit: 0,
        buy_start_time: '',
        buy_end_time: '',
        side: 'long',
        leverage: 1
      }
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogTitle = '添加策略'
      this.dialogVisible = true
    },
    handleEdit(row) {
      // 1. 先处理好时间数组
      let timeRange = []
      if (row.addition_start_time && row.addition_end_time) {
        timeRange = [row.addition_start_time, row.addition_end_time]
      }

      let buyTimeRange = []
      if (row.buy_start_time && row.buy_end_time) {
        buyTimeRange = [row.buy_start_time, row.buy_end_time]
      }

      // 2. 使用 Object.assign 同时合并 row 和 timeRange
      // 这样生成的对象里直接包含了 addition_time_range，Vue 就能监测到了
      this.temp = Object.assign({}, row, {
        addition_time_range: timeRange,
        buy_time_range: buyTimeRange
      })

      this.dialogStatus = 'update'
      this.dialogTitle = '编辑策略'
      // 3. 最后再清除表单验证（可选，防止打开时变红）
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.addition_time_range && this.temp.addition_time_range.length === 2) {
            this.temp.addition_start_time = this.temp.addition_time_range[0]
            this.temp.addition_end_time = this.temp.addition_time_range[1]
          } else {
            this.temp.addition_start_time = ''
            this.temp.addition_end_time = ''
          }

          if (this.temp.buy_time_range && this.temp.buy_time_range.length === 2) {
            this.temp.buy_start_time = this.temp.buy_time_range[0]
            this.temp.buy_end_time = this.temp.buy_time_range[1]
          } else {
            this.temp.buy_start_time = ''
            this.temp.buy_end_time = ''
          }

          // 删除辅助字段
          const postData = Object.assign({}, this.temp)
          delete postData.addition_time_range
          delete postData.buy_time_range

          addStrategyConfig(postData).then(() => {
            this.dialogVisible = false
            this.$message.success('添加成功')
            this.getList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (tempData.addition_time_range && tempData.addition_time_range.length === 2) {
            tempData.addition_start_time = tempData.addition_time_range[0]
            tempData.addition_end_time = tempData.addition_time_range[1]
          } else {
            // 如果清空了时间，需要将字段置为空
            tempData.addition_start_time = ''
            tempData.addition_end_time = ''
          }

          if (tempData.buy_time_range && tempData.buy_time_range.length === 2) {
            tempData.buy_start_time = tempData.buy_time_range[0]
            tempData.buy_end_time = tempData.buy_time_range[1]
          } else {
            tempData.buy_start_time = ''
            tempData.buy_end_time = ''
          }

          // 删除辅助字段，避免传给后端
          delete tempData.addition_time_range
          delete tempData.buy_time_range

          updateStrategyConfig(tempData).then(() => {
            this.dialogVisible = false
            this.$message.success('更新成功')
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该策略?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStrategyConfig(row.id).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    handleStatusChange(row) {
      toggleStrategyConfigStatus({ id: row.id, status: row.status }).then(() => {
        this.$message.success('状态更新成功')
      }).catch(() => {
        row.status = row.status === 1 ? 0 : 1
      })
    },
    handleProfitChange(row) {
      setStrategyConfigProfit({ id: row.id, is_profit: row.is_profit }).then(() => {
        this.$message.success('盈利状态更新成功')
      }).catch(() => {
        row.is_profit = row.is_profit === 1 ? 0 : 1
      })
    },
    handleBatchDelete() {
      this.$confirm('确认批量删除选中策略?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteStrategyConfig({ ids: this.selectedList }).then(() => {
          this.$message.success('批量删除成功')
          this.getList()
        })
      })
    },
    handleBatchToggle(status) {
      const action = status ? '启用' : '禁用'
      this.$confirm(`确认批量${action}选中策略?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchToggleStrategyConfigStatus({ ids: this.selectedList, status: status }).then(() => {
          this.$message.success(`批量${action}成功`)
          this.getList()
        })
      })
    }
  }
}
</script>

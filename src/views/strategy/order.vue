<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="listQuery.keyword" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="statistics" class="statistics-box">
      <!-- 统计数据展示区域，根据实际返回结构调整 -->
      <el-tag type="info">总订单数: {{ statistics.total_count }}</el-tag>
      <el-tag type="success">总盈利: {{ statistics.total_profit }}</el-tag>
    </div>

    <div class="toolbar-box" style="margin: 20px 0;">
      <!-- <el-button type="primary" icon="el-icon-refresh" @click="handleExecuteProfit">执行收益</el-button> -->
      <!-- <el-button type="danger" icon="el-icon-close" :disabled="selectedList.length === 0"
        @click="handleBatchForceClose">
        批量强制平仓
      </el-button>
      <el-button type="danger" icon="el-icon-delete" :disabled="selectedList.length === 0" @click="handleBatchDelete">
        批量删除
      </el-button> -->
    </div>

    <el-table v-loading="loading" :data="list" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="order_no" label="订单号" min-width="150" />
      <el-table-column prop="username" label="用户" width="120" align="center" />
      <el-table-column prop="strategy_config.coin_name" label="策略币种" width="100" align="center" />
      <el-table-column prop="side" label="方向" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.side === 'long' ? 'success' : 'danger'">
            {{ row.side === 'long' ? '买入' : '卖出' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="buy_amount" label="买入金额" width="120" align="center" />
      <el-table-column prop="leverage" label="杠杆" width="80" align="center" />
      <el-table-column prop="entry_price" label="入场价格" width="120" align="center" />
      <el-table-column prop="amount" label="持仓数量" width="120" align="center" />
      <el-table-column prop="addition_times_actual" label="补单次数" width="120" align="center" />
      <el-table-column label="补单金额(需/实)" width="150" align="center">
        <template slot-scope="{row}">
          {{ row.strategy_config.total_addition_amount }} / {{ row.total_addition_actual }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="补单次数(需/实)" width="150" align="center">
        <template slot-scope="{row}">
          {{ row.total_addition_times_required }} / {{ row.addition_times_actual }}
        </template>
      </el-table-column> -->
      <el-table-column prop="fee" label="手续费" width="100" align="center" />
      <el-table-column prop="pnl" label="盈亏" width="120" align="center">
        <template slot-scope="{row}">
          <span :style="{ color: row.pnl >= 0 ? 'green' : 'red' }">{{ row.pnl }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="160" align="center" />
      <el-table-column label="状态" width="100" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-tag :type="row.status_color">
            {{ row.status_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="{row}">
          <!-- <el-button type="warning" size="mini" @click="handleForceClose(row)" v-if="row.status === 1">强平</el-button> -->
          <el-button type="danger" size="mini" @click="handleForceLiquidate(row)" v-if="row.status === 1">爆仓</el-button>
          <!-- <el-button type="primary" size="mini" @click="handleEditPnl(row)" v-if="row.status !== 1">改盈亏</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box" style="margin-top: 20px; text-align: right;">
      <el-pagination background :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100]"
        :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 修改盈亏对话框 -->
    <el-dialog title="修改订单盈亏" :visible.sync="pnlDialogVisible" width="400px">
      <el-form :model="pnlTemp" label-width="100px">
        <el-form-item label="当前盈亏">
          <el-input v-model="pnlTemp.old_pnl" disabled />
        </el-form-item>
        <el-form-item label="新盈亏">
          <el-input v-model="pnlTemp.new_pnl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pnlDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPnlUpdate">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getStrategyOrderList,
  getStrategyOrderStatistics,
  forceCloseStrategyOrder,
  forceLiquidateStrategyOrder,
  updateStrategyOrderPnl,
  deleteStrategyOrder,
  batchForceCloseStrategyOrder,
  batchDeleteStrategyOrder,
  executeStrategyProfit
} from '@/api/strategy'

export default {
  name: 'StrategyOrder',
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
      statistics: null,
      selectedList: [],
      pnlDialogVisible: false,
      pnlTemp: {
        id: undefined,
        old_pnl: 0,
        new_pnl: 0
      }
    }
  },
  created() {
    this.getList()
    this.getStatistics()
  },
  methods: {
    handleExecuteProfit() {
      this.$confirm('确认执行收益?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        executeStrategyProfit().then(() => {
          this.$message.success('执行收益成功')
          this.getList()
        })
      })
    },
    getList() {
      this.loading = true
      getStrategyOrderList(this.listQuery).then(({ data }) => {
        this.list = data.data
        this.total = data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getStatistics() {
      getStrategyOrderStatistics().then(response => {
        this.statistics = response.data
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
    handleForceClose(row) {
      this.$confirm('确认强制平仓该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        forceCloseStrategyOrder({ id: row.id }).then(() => {
          this.$message.success('强制平仓成功')
          this.getList()
        })
      })
    },
    handleForceLiquidate(row) {
      this.$confirm('确认强制爆仓该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        forceLiquidateStrategyOrder({ id: row.id }).then(() => {
          this.$message.success('强制爆仓成功')
          this.getList()
        })
      })
    },
    handleEditPnl(row) {
      this.pnlTemp = {
        id: row.id,
        old_pnl: row.pnl,
        new_pnl: row.pnl
      }
      this.pnlDialogVisible = true
    },
    submitPnlUpdate() {
      updateStrategyOrderPnl({ id: this.pnlTemp.id, pnl: this.pnlTemp.new_pnl }).then(() => {
        this.pnlDialogVisible = false
        this.$message.success('盈亏修改成功')
        this.getList()
      })
    },
    handleBatchForceClose() {
      this.$confirm('确认批量强制平仓选中订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchForceCloseStrategyOrder({ ids: this.selectedList }).then(() => {
          this.$message.success('批量强制平仓成功')
          this.getList()
        })
      })
    },
    handleBatchDelete() {
      this.$confirm('确认批量删除选中订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteStrategyOrder({ ids: this.selectedList }).then(() => {
          this.$message.success('批量删除成功')
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>
.statistics-box {
  margin-bottom: 20px;
}
</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>最近交易</span>
      <el-link type="primary" style="float: right; padding: 3px 0" href="#/order/olist">查看更多</el-link>
    </div>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column prop="username" label="会员">
      </el-table-column>
      <el-table-column prop="lottery_name" width="100" label="彩种">
      </el-table-column>
      <el-table-column prop="number" width="140" label="期号">
      </el-table-column>
      <el-table-column prop="count" label="注数">
        <template slot-scope="{row}">
          {{row.count}} 注
        </template>
      </el-table-column>
      <el-table-column label="投注金额" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.amount}}
        </template>
      </el-table-column>
      <el-table-column prop="profit" label="盈利">
        <template slot-scope="{row}">
          <span v-if="row.flag>0" style="color:#1d8e11;font-weight: bold;">+{{row.profit}}</span>
          <span style="color:#d2493f;font-weight: bold;" v-else>{{row.profit}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag size="small" v-if="row.status==0">未开奖</el-tag>
          <el-tag size="small" type="success" v-else-if="row.status==2">已中奖</el-tag>
          <el-tag size="small" type="danger" v-else-if="row.status==1">未中奖</el-tag>
          <el-tag size="small" type="info" v-else-if="row.status==3">已撤单</el-tag>
          <el-tag size="small" v-else>未开奖</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {getList} from '@/api/bet.js'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getList('size=10').then(res=>{
        this.list = res.data;
      });
      setTimeout(this.fetchData,30000);
    }
  }
}
</script>

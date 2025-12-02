<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>最近充值</span>
      <el-link type="primary" style="float: right; padding: 3px 0" href="#/money/recharge">查看更多</el-link>
    </div>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column prop="payment" label="充值平台">
      </el-table-column>
      <el-table-column prop="username" label="充值用户">
      </el-table-column>
      <el-table-column prop="amount" label="充值金额">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{row}">
          <el-tag size="small" v-if="row.status==0">{{row.statusName}}</el-tag>
          <el-tag size="small" type="success" v-else-if="row.status==1">{{row.statusName}}</el-tag>
          <el-tag size="small" type="danger" v-else-if="row.status==2">{{row.statusName}}</el-tag>
          <el-tag size="small" type="info" v-else>{{row.statusName}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {getList} from '@/api/recharge.js'
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
      })
      setTimeout(this.fetchData,30000);
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户">
          <el-input v-model="formLine.username" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="formLine.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="formLine.status" @change="handleClickTab">
          <el-radio-button label="0">全部</el-radio-button>
          <el-radio-button :label="item.value" v-for="(item,index) in options" :key="index">{{item.label}}</el-radio-button>
        </el-radio-group>
      </div>

      <el-table
        :data="tableData"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          align="center"
          fixed="left"
          width="80">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="fee"
          label="借入"
          align="center"
          min-width="150">
          <template slot-scope="{row}">
            {{row.num}} {{row.to_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="质押"
          align="center"
          min-width="150">
          <template slot-scope="{row}">
            {{row.from_num}} {{row.from_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          label="日利率"
          align="center"
          width="100">
          <template slot-scope="{row}">
            {{row.rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==0">{{row.statusName}}</el-tag>
            <el-tag type="warning" v-else-if="row.status==1">{{row.statusName}}</el-tag>
            <el-tag type="success" v-else-if="row.status==2">{{row.statusName}}</el-tag>
            <el-tag type="danger" v-else-if="row.status==3">{{row.statusName}}</el-tag>
            <el-tag type="info" v-else>{{row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="下单时间">
        </el-table-column>
        <el-table-column
          width="300"
          fixed="right"
          label="操作">
          <template slot-scope="{row}">
            <el-button @click="passTrade(row)" :disabled="row.status != 0" type="success">审核</el-button>
            <el-button @click="refuseTrade(row)" :disabled="row.status != 0" type="danger">拒绝</el-button>
            <el-button @click="successTrade(row)" :disabled="row.status != 1" type="primary">还款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagesize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="meta.total">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import { getList,repaymentBorrow,passBorrow,refuseBorrow} from '@/api/borrow'
import {coinSelectList} from '@/api/coin'

export default {
  name: 'borrow',
  data(){
    return {
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'0',
      loading:false,
      formLine:{
        username:'',
        date:null
      },
      selectList:[],
      options: [{
        value: '1',
        label: '借币中'
      }, {
        value: '2',
        label: '已还款'
      }],
    }
  },
  computed: {

  },
  created() {
    this.getSelectList();
    this.getList();
  },
  activated() {
    this.getSelectList();
  },
  methods:{
    getSelectList(){
      coinSelectList().then(res=>{
        this.selectList = res.data
      })
    },
    search(){
      this.page = 1;
      this.getList();
    },
    handleClickTab(val){
      this.formLine.status = val;
      this.page = 1;
      this.getList();
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&username="+this.formLine.username+"&status="+this.formLine.status;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    handleSelectionChange(val){
      this.selectList = [];
      for(var i=0;i<val.length;i++){
        this.selectList.push(val[i].id);
      }
    },
    successTrade(row){
      this.$confirm('是否对此订单进行【还款】操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        repaymentBorrow(row.id).then(res => {
          this.getList();
          this.$message.success(res.message)
        })
      })
    },
    passTrade(row){
      this.$confirm('是否对此订单进行【审核】操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        passBorrow(row.id).then(res => {
          this.getList();
          this.$message.success(res.message)
        })
      })
    },
    refuseTrade(row){
      this.$confirm('是否对此订单进行【拒绝】操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuseBorrow(row.id).then(res => {
          this.getList();
          this.$message.success(res.message)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

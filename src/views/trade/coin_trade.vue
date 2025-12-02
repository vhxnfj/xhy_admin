<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.order_no" placeholder="流水号" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.username" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="formLine.coin_id" style="width: 120px;" placeholder="请选择" clearable>
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型" prop="type">
          <el-select v-model="formLine.type" clearable placeholder="请选择" style="width: 120px;">
            <el-option value="1" label="买入"></el-option>
            <el-option value="2" label="卖出"></el-option>
          </el-select>
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
          prop="order_no"
          label="流水号"
          align="center"
          fixed="left"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="coin"
          label="交易币种"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="status"
          label="交易类型"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-tag effect="dark" type="success" v-if="row.type==0">{{row.typeName}}</el-tag>
            <el-tag effect="dark" v-else-if="row.type==1">{{row.typeName}}</el-tag>
            <el-tag effect="dark" type="info" v-else>{{row.typeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="交易数量"
          align="center"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="price"
          label="交易单价"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="fee"
          label="手续费"
          align="center"
          width="100">
          <template slot-scope="{row}">
            {{row.fee}} {{row.trade_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          label="手续费费率"
          align="center"
          width="100">
          <template slot-scope="{row}">
            {{row.rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==0">{{row.statusName}}</el-tag>
            <el-tag type="success" v-else-if="row.status==1">{{row.statusName}}</el-tag>
            <el-tag type="info" v-else>{{row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="updated_at"
          width="160"
          label="最后更新">
        </el-table-column>
        <el-table-column
          width="100"
          fixed="right"
          label="操作">
          <template slot-scope="{row}">
            <el-button @click="successTrade(row)" type="primary">完成</el-button>
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
import { getList,successTrade} from '@/api/coin_trade'
import {coinSelectList} from '@/api/coin'

export default {
  name: 'coin_trade',
  data(){
    return {
      dialogShow:false,
      dialogShow2:false,
      dialogShow3:false,
      props:{
        label: 'title',
        children: 'children',
        isLeaf: 'leaf'
      },
      treeData:[],
      nowRow:null,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'0',
      loading:false,
      formLine:{
        order_no:'',
        username:'',
        type:'',
        coin_id:'',
        date:null
      },
      selectList:[],
      options: [{
        value: '1',
        label: '委托中'
      }, {
        value: '2',
        label: '已完成'
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
        +"&order_no="+this.formLine.order_no+"&username="+this.formLine.username+"&type="+this.formLine.type
        +"&coin_id="+this.formLine.coin_id+"&status="+this.formLine.status;
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
      successTrade(row.id).then(res=>{
        this.$message.success(res.message)
      })
    }
  }
}
</script>

<style scoped>

</style>

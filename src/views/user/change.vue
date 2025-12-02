<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="关键词" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.username" style="width: 120px;" placeholder="登陆名" clearable></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model="formLine.admin" style="width: 120px;" placeholder="登陆名" clearable></el-input>
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
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有类型</el-radio-button>
          <el-radio-button label="1">增加金额</el-radio-button>
          <el-radio-button label="2">扣除金额</el-radio-button>
        </el-radio-group>
      </div>

      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="created_at"
          label="时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="info"
          label="账变信息"
          min-width="160">
          <template slot-scope="{row}">
            <div v-if="row.trade_order_no"><el-link type="primary" @click="viewOrder(row)">{{row.info}}</el-link></div>
            <div v-else>{{row.info}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          align="center"
          min-width="100">
          <template slot-scope="{row}">
            <div v-if="row.positive" style="color: #44aa77">+{{row.amount}}</div>
            <div v-else style="color: #dd1100;">{{row.amount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          align="center"
          label="用户">
        </el-table-column>
        <el-table-column
          prop="before_amount"
          align="center"
          label="账变前余额">
        </el-table-column>
        <el-table-column
          prop="after_amount"
          align="center"
          label="账变后余额">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="admin"
          align="center"
          label="管理员">
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
  import {getUserChangeList} from '@/api/user'

  export default {
    name: 'change',
    data(){
      return {
        formLine:{
          username:'',
          keyword:'',
          admin:'',
          date:null
        },
        tableData: [],
        page:1,
        pagesize:20,
        meta:{
          total:0
        },
        activeType:'-1',
        loading:false,
        typeList:[
          {
            value:1,
            label:'普通信息'
          },
          {
            value:2,
            label:'警告信息'
          },
          {
            value:3,
            label:'危险信息'
          }
        ]
      }
    },
    created() {
      if(this.$route.query.username){
        this.formLine.username = this.$route.query.username;
      }
      this.getList();
    },
    activated() {
      if(this.$route.query.username){
        this.formLine.username = this.$route.query.username;
        this.getList();
      }else{
        this.formLine.username = '';
      }
    },
    methods:{
      search(){
        this.page = 1;
        this.getList();
      },
      handleClickTab(val){
        this.activeType = val;
        this.page = 1;
        this.getList();
      },
      getList(){
        var param = 'page='+this.page+"&pagesize="+this.pagesize
          +"&username="+this.formLine.username+"&keyword="+this.formLine.keyword
          +"&admin="+this.formLine.admin
          +"&type="+this.activeType;
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        this.loading = true;
        getUserChangeList(param).then(res=>{
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
      viewOrder(row){

      }
    }
  }
</script>

<style scoped>

</style>

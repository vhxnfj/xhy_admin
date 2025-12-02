<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="流水号/地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.name" placeholder="用户名" style="width: 120px;" clearable></el-input>
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
      <div style="margin-bottom: 20px;">
        <el-tag type="success">当日充值：{{tongji.today}} USDT</el-tag>
        <el-tag>总充值：{{tongji.total}} USDT</el-tag>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="order_no"
          label="流水号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="team_flag"
          label="团队"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="num"
          label="充值数量"
          align="center"
          width="180">
          <template slot-scope="{row}">
            {{row.num}} {{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="addr"
          label="充值地址"
          align="center"
          min-width="320">
        </el-table-column>
        <el-table-column
          prop="coin_type"
          label="合约类型"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="创建时间">
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
import {coinSelectList} from '@/api/coin'
import {getRechargeList,getRechargeTongji} from '@/api/finance'

export default {
  name: 'recharge',
  data(){
    return {
      dialogShow:false,
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
      formData:{
        username:'',
        coin_id:'',
        amount:''
      },
      updateForm:{

      },
      formLine:{
        keyword:'',
        name:'',
        coin_id:'',
        to_coin_id:'',
        date:null
      },
      selectList:[],
      tongji:{
        today:0,
        total:0
      }
    }
  },
  computed: {

  },
  created() {
    this.getList();
    this.getSelectList();
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
      this.activeType = val;
      this.page = 1;
      this.getList();
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&keyword="+this.formLine.keyword+"&name="+this.formLine.name
        +"&coin_id="+this.formLine.coin_id;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getRechargeTongji(param).then(res=>{
        this.tongji = res.data;
      })
      getRechargeList(param).then(res=>{
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
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="地址" clearable></el-input>
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
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有状态</el-radio-button>
          <el-radio-button label="1">审核中</el-radio-button>
          <el-radio-button label="2">已审核</el-radio-button>
          <el-radio-button label="3">已拒绝</el-radio-button>
          <el-radio-button label="4">已成功</el-radio-button>
          <el-radio-button label="5">已失败</el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding: 20px;background: #f1f1f1;">
        待审核：<b>{{tongji.waiting}}</b>，已完成：<b>{{tongji.success}}</b>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          fixed="left"
          width="120">
        </el-table-column>
        <el-table-column
          prop="team_flag"
          label="团队标识"
          min-width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="num"
          label="提币数量"
          align="center"
          width="200">
          <template slot-scope="{row}">
            {{row.num}} {{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="addr"
          label="提币地址"
          min-width="320"
          align="center">
        </el-table-column>
        <el-table-column
          prop="coin_type"
          label="合约类型"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="fee"
          label="手续费"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="fee_rate"
          label="费率"
          align="center"
          width="100">
          <template slot-scope="{row}">
            {{row.fee_rate}} %
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          fixed="right"
          width="100">
          <template slot-scope="{row}">
            <el-tag type="warning" v-if="row.status == 0">待审核</el-tag>
            <el-tag v-else-if="row.status == 1">已审核</el-tag>
            <el-tag type="danger" v-else-if="row.status == 2">已拒绝</el-tag>
            <el-tag type="success" v-else-if="row.status == 3">已成功</el-tag>
            <el-tag type="info" v-else-if="row.status == 4">已失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="220">
          <template slot-scope="{row}">
            <el-button type="primary" :disabled="row.status != 0" size="small" @click="onDaifu(row.id)">审核</el-button>
            <el-button type="danger" :disabled="row.status != 0 && row.status != 1" size="small" @click="onRefuse(row.id)">拒绝</el-button>
            <el-button type="success" :disabled="row.status != 0 && row.status != 1" size="small" @click="onSuccess(row.id)">完成</el-button>
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
import {coinSelectList} from '@/api/coin'
import {getOutList, getOutTongji, doSuccess, doRefuse, doDaifu} from '@/api/finance'

export default {
  name: 'out',
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
      tongji:{waiting:'-',success:'-'}
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
        +"&coin_id="+this.formLine.coin_id+"&status="+this.activeType;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getOutList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
      getOutTongji(param).then(res=>{
        this.tongji = res.data
      })
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    onSuccess(id){
      this.$confirm('是否完成此提现申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doSuccess(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    onDaifu(id){
      this.$confirm('是否审核此提现申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doDaifu(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    onRefuse(id){
      this.$confirm('是否拒绝此提现申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doRefuse(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    }
  }
}
</script>

<style scoped>

</style>

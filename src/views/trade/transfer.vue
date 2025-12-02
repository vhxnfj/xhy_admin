<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.order_no" placeholder="流水号" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.name" placeholder="用户名" style="width: 120px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="收币用户">
          <el-input v-model="formLine.to_user" placeholder="用户名" style="width: 120px;" clearable></el-input>
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
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="order_no"
          label="流水号"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="转币用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="to_user"
          label="收币用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="num"
          label="转币数量"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="coin"
          label="币种"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="fee"
          label="手续费"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="fee_rate"
          label="费率"
          align="center"
          width="80">
          <template slot-scope="{row}">{{row.fee_rate}} %</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.status == 0">{{ row.statusName }}</el-tag>
            <el-tag type="success" v-else-if="row.status == 1">{{ row.statusName }}</el-tag>
            <el-tag type="danger" v-else-if="row.status == 2">{{ row.statusName }}</el-tag>
          </template>
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
import {getTransList} from '@/api/trade'

export default {
  name: 'transfer',
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
        order_no:'',
        name:'',
        coin_id:'',
        to_user:'',
        date:null
      },
      selectList:[]
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
        +"&order_no="+this.formLine.order_no+"&name="+this.formLine.name
        +"&coin_id="+this.formLine.coin_id+"&to_user="+this.formLine.to_user;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getTransList(param).then(res=>{
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

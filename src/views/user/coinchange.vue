<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户">
          <el-input v-model="formLine.name" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="转账人">
          <el-input v-model="formLine.from_user" placeholder="转账人用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="关键词" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="coin_id">
          <el-select v-model="formLine.coin_id" clearable placeholder="请选择">
            <el-option
              v-for="item in coinList"
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
          prop="username"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="coin"
          label="币种"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          width="140">
          <template slot-scope="{row}">
            <div style="color: #44aa77" v-if="row.flag">+{{row.num}}</div>
            <div style="color: #dd1100" v-else>{{row.num}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="冻结"
          width="140">
          <template slot-scope="{row}">
            <div style="color: #44aa77" v-if="row.flag2">+{{row.frozen}}</div>
            <div style="color: #dd1100" v-else>{{row.frozen}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="before_num"
          label="账变前"
          width="140">
        </el-table-column>
        <el-table-column
          prop="after_num"
          label="账变后"
          width="140">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="admin"
          label="管理员"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="from_user"
          label="转账人"
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
import {getChangeList} from '@/api/usercoin'

export default {
  name: 'coinchange',
  data(){
    return {
      dialogShow:false,
      dialogShow2:false,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'-1',
      loading:false,
      formData:{
        username:'',
        coin_id:'',
        amount:''
      },
      updateForm:{

      },
      formLine:{
        name:'',
        keyword:'',
        coin_id:'',
        from_user:'',
        date:null
      },
      coinList:[]
    }
  },
  computed: {

  },
  created() {
    this.getList();
    this.getCoinList();
  },
  activated() {
    this.getCoinList();
  },
  methods:{
    getCoinList(){
      coinSelectList().then(res=>{
        this.coinList = res.data
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
        +"&name="+this.formLine.name+"&from_user="+this.formLine.from_user
        +"&coin_id="+this.formLine.coin_id + "&keyword="+this.formLine.keyword;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getChangeList(param).then(res=>{
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

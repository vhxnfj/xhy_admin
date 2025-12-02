<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="关键词" clearable></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model="formLine.username" placeholder="登陆名" clearable></el-input>
        </el-form-item>
        <el-form-item label="IP">
          <el-input v-model="formLine.ip_addr" placeholder="IP地址" clearable></el-input>
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
          <el-radio-button label="-1">所有类型</el-radio-button>
          <el-radio-button :label="item.value+''" v-for="(item,key) in typeList" :key="key">{{item.label}}</el-radio-button>
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
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="日志信息"
          min-width="160">
          <template slot-scope="{row}">
            <div v-if="row.type == 1" style="color: chocolate">
              <i class="el-icon-warning">&nbsp;{{row.title}}</i>
            </div>
            <div v-else-if="row.type == 2" style="color: red">
              <i class="el-icon-error">&nbsp;{{row.title}}</i>
            </div>
            <div v-else>
              <i class="el-icon-info">&nbsp;{{row.title}}</i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="api_name"
          label="访问接口"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          align="center"
          label="访问用户">
        </el-table-column>
        <el-table-column
          prop="ip_addr"
          align="center"
          label="IP地址">
        </el-table-column>
        <el-table-column
          prop="params"
          align="center"
          label="参数">
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
  import {getLog} from '@/api/system'

  export default {
    name: 'log',
    data(){
      return {
        formLine:{
          username:'',
          keyword:'',
          ip_addr:'',
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
      this.getList();
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
          +"&type="+this.activeType + "&ip_addr="+this.formLine.ip_addr;
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        this.loading = true;
        getLog(param).then(res=>{
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

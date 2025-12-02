<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="版本号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" round>添加版本</el-button>
    </div>
    <el-dialog
      title="APP版本信息"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="dataForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="dataForm.version"></el-input>
        </el-form-item>
        <el-form-item label="更新内容" prop="text">
          <el-input type="textarea" :rows="6" v-model="dataForm.text"></el-input>
        </el-form-item>
        <el-form-item label="安卓下载地址" prop="android">
          <el-input v-model="dataForm.android"></el-input>
        </el-form-item>
        <el-form-item label="苹果下载地址" prop="ios">
          <el-input v-model="dataForm.ios"></el-input>
        </el-form-item>
        <el-form-item label="资源下载地址" prop="wgt">
          <el-input v-model="dataForm.wgt"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="submiting" :loading="submiting">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="version"
          label="版本号">
        </el-table-column>
        <el-table-column
          prop="text"
          align="center"
          label="更新内容">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="发布时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
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
          :current-page.sync="page"
          :total="meta.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {getApp,addApp,updateApp,deleteApp} from '@/api/app'

  export default {
    name: 'app',
    data(){
      return {
        formLine:{
          keyword:''
        },
        tableData: [],
        page:1,
        pagesize:20,
        meta:{
          total:0
        },
        activeType:'0',
        loading:false,
        dialogShow:false,
        submiting:false,
        dataForm:{

        }
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
        var param = 'page='+this.page+"&pagesize="+this.pagesize +"&keyword="+this.formLine.keyword;
        this.loading = true;
        getApp(param).then(res=>{
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
      handleAdd(){
        this.dataForm = {
          version:'',
          text:'',
          android:'',
          ios:'',
          wgt:''
        };
        this.dialogShow = true;
      },
      handleEdit(row){
        this.dataForm = {
          id:row.id,
          version:row.version,
          text:row.text,
          android:row.android,
          ios:row.ios,
          wgt:row.wgt
        };
        this.dialogShow = true;
      },
      onDelete(id){
        this.$confirm('是否删除此版本？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteApp(id).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.dataForm.id){
          updateApp(this.dataForm).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.getList();
            this.$message.success(res.message);
          }).catch(error=>{
            this.submiting = false;
          });
        }else{
          addApp(this.dataForm).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.getList();
            this.$message.success(res.message);
          }).catch(error=>{
            this.submiting = false;
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="管理员">
          <el-input v-model="formLine.admin" placeholder="管理员" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" round>添加公告</el-button>
    </div>
    <el-dialog
      title="系统公告"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="dataForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :rows="6" v-model="dataForm.content"></el-input>
        </el-form-item>
        <el-form-item label="置顶" prop="is_top">
          <el-radio v-model="dataForm.is_top" :label="0">不置顶</el-radio>
          <el-radio v-model="dataForm.is_top" :label="1">置顶</el-radio>
        </el-form-item>
        <el-form-item label="弹窗" prop="is_popup">
          <el-radio v-model="dataForm.is_popup" :label="0">不弹窗</el-radio>
          <el-radio v-model="dataForm.is_popup" :label="1">弹窗</el-radio>
        </el-form-item>
        <el-form-item label="发布时间" prop="created_at">
          <el-date-picker
            v-model="dataForm.created_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
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
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="admin"
          align="center"
          label="发布人">
        </el-table-column>
        <el-table-column
          prop="is_top"
          align="center"
          label="是否置顶">
          <template slot-scope="{row}">
            <el-tag type="warning" v-if="row.is_top">置顶</el-tag>
            <el-tag type="info" v-else>不置顶</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_top"
          align="center"
          label="是否弹窗">
          <template slot-scope="{row}">
            <el-tag type="warning" v-if="row.is_popup">弹窗</el-tag>
            <el-tag type="info" v-else>不弹窗</el-tag>
          </template>
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
  import {getNotice,addNotice,updateNotice,deleteNotice} from '@/api/notice'

  export default {
    name: 'notice',
    data(){
      return {
        formLine:{
          admin:''
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
        var param = 'page='+this.page+"&pagesize="+this.pagesize +"&admin="+this.formLine.admin;
        this.loading = true;
        getNotice(param).then(res=>{
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
          title:'',
          content:'',
          is_top:0,
          is_popup:0,
          created_at:''
        };
        this.dialogShow = true;
      },
      handleEdit(row){
        this.dataForm = {
          id:row.id,
          title:row.title,
          content:row.content,
          is_top:row.is_top,
          is_popup:row.is_popup,
          created_at:row.created_at
        };
        this.dialogShow = true;
      },
      onDelete(id){
        this.$confirm('是否删除此公告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNotice(id).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.dataForm.id){
          updateNotice(this.dataForm).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.getList();
            this.$message.success(res.message);
          }).catch(error=>{
            this.submiting = false;
          });
        }else{
          addNotice(this.dataForm).then(res=>{
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

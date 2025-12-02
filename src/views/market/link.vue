<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formLine.title" placeholder="关键词" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" round>添加链接</el-button>
    </div>
    <el-dialog
      title="友情链接"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="dataForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop=" url">
          <el-input v-model="dataForm.url"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort_num">
          <el-input v-model="dataForm.sort_num" style="width: 100px;"></el-input>
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
          prop="name"
          label="图标"
          width="150">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <el-upload
                class="link-uploader"
                :action="uploadUrl"
                :headers="headers"
                :data="scope.row"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :on-error="handelLogoError">
                <img v-if="scope.row.logo" :src="scope.row.logo" style="width: 120px;" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="url"
          align="center"
          label="链接">
        </el-table-column>
        <el-table-column
          prop="sort_num"
          align="center"
          label="排序">
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
import {getLink,addLink,updateLink,deleteLink} from '@/api/link'
import { getToken } from '@/utils/auth'

export default {
  name: 'flink',
  data(){
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + 'link/upload/logo',
      headers:{
        Authorization:'Bearer '+getToken()
      },
      formLine:{
        title:''
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
      var param = 'page='+this.page+"&pagesize="+this.pagesize +"&title="+this.formLine.title;
      this.loading = true;
      getLink(param).then(res=>{
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
        is_top:0
      };
      this.dialogShow = true;
    },
    handleEdit(row){
      this.dataForm = {
        id:row.id,
        title:row.title,
        url:row.url,
        sort_num:row.sort_num
      };
      this.dialogShow = true;
    },
    onDelete(id){
      this.$confirm('是否删除此链接？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLink(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    onSubmit(){
      this.submiting = true;
      if(this.dataForm.id){
        updateLink(this.dataForm).then(res=>{
          this.submiting = false;
          this.dialogShow = false;
          this.getList();
          this.$message.success(res.message);
        }).catch(error=>{
          this.submiting = false;
        });
      }else{
        addLink(this.dataForm).then(res=>{
          this.submiting = false;
          this.dialogShow = false;
          this.getList();
          this.$message.success(res.message);
        }).catch(error=>{
          this.submiting = false;
        });
      }
    },
    handleLogoSuccess(res,file){
      var data = res.data;
      for(var i=0;i<this.tableData.length;i++){
        var item = this.tableData[i];
        if(item.id == data.id){
          item.logo = data.path;
          break;
        }
      }
    },
    handelLogoError(err, file, fileList){
      this.$message.error(JSON.parse(err.message).message)
    },
  }
}
</script>

<style scoped>

</style>

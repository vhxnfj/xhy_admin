<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.title" placeholder="关键词" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" round>添加文章</el-button>
      <span style="margin-left: 20px;font-size: 12px;color: #999999;">app页面『/pages/article/article?id=ID号』如需不显示日期则加『&hidetime=1』</span>
    </div>
    <el-card class="app-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="read_count"
          align="center"
          label="阅读数">
        </el-table-column>
        <el-table-column
          prop="is_top"
          align="center"
          label="是否推荐">
          <template slot-scope="{row}">
            <el-switch
              @change="topChange(row)"
              v-model="row.is_top"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="是否启用">
          <template slot-scope="{row}">
            <el-switch
              @change="stopChange(row)"
              v-model="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
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
  import {getArticleList,deleteArticle,stopArticle,openArticle,topArticle,stopTopArticle} from '@/api/article'

  export default {
    name: 'myarticle',
    data(){
      return {
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
    activated() {
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
        getArticleList(param).then(res=>{
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
        this.$router.push("/market/editArticle")
      },
      handleEdit(row){
        this.$router.push({path:"/market/editArticle",query:{id:row.id}})
      },
      onDelete(id){
        this.$confirm('是否删除此公告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(id).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      stopChange(row){
        if(!row.status){
          stopArticle(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.status = true
          })
        }else{
          openArticle(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.status = false
          })
        }
      },
      topChange(row){
        if(row.is_top){
          topArticle(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.is_top = false
          })
        }else{
          stopTopArticle(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.is_top = true
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>

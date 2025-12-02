<template>
  <div class="app-container">
    <el-card class="app-container">
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="username"
          fixed="left"
          label="用户名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="real_name"
          label="真实姓名"
          align="center"
          fixed="left"
          width="80">
        </el-table-column>
        <el-table-column
          prop="id_card"
          label="身份证号">
        </el-table-column>
        <el-table-column
          prop="idcard_file1"
          label="身份证正面照">
          <template slot-scope="{row}">
            <el-image :src="row.idcard_file1" style="width: 200px;height: 100px;" :preview-src-list="[row.idcard_file1]"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="idcard_file2"
          label="身份证背面照">
          <template slot-scope="{row}">
            <el-image :src="row.idcard_file2" style="width: 200px;height: 100px;" :preview-src-list="[row.idcard_file2]"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="idcard_file3"
          label="手持身份证">
          <template slot-scope="{row}">
            <el-image :src="row.idcard_file3" style="width: 200px;height: 100px;" :preview-src-list="[row.idcard_file3]"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleAuth(row,3)">通过审核</el-button>
            <el-button type="danger" size="small" @click="handleAuth(row,4)">拒绝通过</el-button>
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
import {getAuthList,setAuth} from '@/api/user'

export default {
  name: 'userauth',
  data(){
    return {
      dialogShow:false,
      dialogShow2:false,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      }
    }
  },
  computed: {

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
      var param = 'page='+this.page+"&pagesize="+this.pagesize;
      this.loading = true;
      getAuthList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
    },
    handleCancel(){
      this.dialogShow = false;
      this.resetForm();
    },
    handleAdd(row){
      this.dialogShow = true;
      if(row){
        this.formData.username = row.username;
        this.formData.coin_id = row.coin_id
      }
    },
    resetForm(){
      this.formData = {
        username:'',
        coin_id:'',
        amount:''
      }
    },
    handleAuth(row,type){
      this.$confirm('确认'+(type == 3 ? '通过' : '拒绝')+'审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setAuth({id: row.id, type: type}).then(res => {
          this.getList();
          this.$message.success(res.message);
        });
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
    handleSelectionChange(val){
      this.selectList = [];
      for(var i=0;i<val.length;i++){
        this.selectList.push(val[i].id);
      }
    }
  }
}
</script>

<style scoped>

</style>

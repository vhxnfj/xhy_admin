<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户">
          <el-input v-model="formLine.name" placeholder="用户名" style="width: 120px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户">
          <el-input v-model="formLine.shop_name" placeholder="商户名" style="width: 120px;" clearable></el-input>
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
          <el-radio-button label="2">已通过</el-radio-button>
          <el-radio-button label="3">已拒绝</el-radio-button>
        </el-radio-group>
      </div>
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
          prop="shop_name"
          label="商户名称"
          align="center"
          fixed="left"
          width="120">
        </el-table-column>
        <el-table-column
          prop="contact_type"
          label="联系方式"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="contact_name"
          label="联系账号"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="real_name"
          label="真实姓名"
          align="center"
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
          prop="status"
          label="审核状态"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <el-tag type="warning" v-if="row.status == 0">待审核</el-tag>
            <el-tag type="success" v-else-if="row.status == 1">已通过</el-tag>
            <el-tag type="danger" v-else-if="row.status == 2">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="时间">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">创建时间：</div><div>{{row.created_at}}</div>
            <div style="font-size: 12px;color: #42b983;">最后修改：</div><div>{{row.updated_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handlePass(row)">通过审核</el-button>
            <el-button type="danger" size="small" @click="handleRefuse(row)">拒绝通过</el-button>
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
import {getMerchantList,passMerchant,refuseMerchant,updateMerchant} from '@/api/merchant'

export default {
  name: 'merchant',
  data(){
    return {
      dialogShow:false,
      dialogShow2:false,
      tableData: [],
      page:1,
      pagesize:20,
      activeType:'',
      meta:{
        total:0
      },
      formLine:{
        name:'',
        shop_name:'',
        date:null
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
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&name="+this.formLine.name+'&shop_name='+this.formLine.shop_name+"&status="+this.activeType;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getMerchantList(param).then(res=>{
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
    handlePass(row){
      this.$confirm('确认通过审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        passMerchant(row.id).then(res => {
          this.getList();
          this.$message.success(res.message);
        });
      });
    },
    handleRefuse(row){
      this.$prompt('请输入拒绝原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        refuseMerchant({id:row.id,info:value}).then(res=>{
          this.getList();
          this.$message.success(res.message)
        })
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

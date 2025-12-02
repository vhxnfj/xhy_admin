<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="余额">
          <el-input v-model="formLine.min" style="width: 100px;" placeholder="数字" clearable></el-input>
          -
          <el-input v-model="formLine.max" style="width: 100px;" placeholder="数字" clearable></el-input>
        </el-form-item>
        <el-form-item label="理财">
          <el-input v-model="formLine.licai_min" style="width: 100px;" placeholder="数字" clearable></el-input>
          -
          <el-input v-model="formLine.licai_max" style="width: 100px;" placeholder="数字" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="coin_type">
          <el-select v-model="formLine.coin_id" clearable placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="白名单" prop="white">
          <el-select style="width: 120px;" v-model="formLine.white" clearable placeholder="请选择">
            <el-option value="1" label="去白名单"></el-option>
            <el-option value="2" label="仅白名单"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>修改资产</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>清除充值地址</el-button>
    </div>
    <el-dialog
      title="修改资产"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户名" prop="title">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="币种类型" prop="coin_type">
          <el-select v-model="formData.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币数" prop="price">
          <el-input v-model="formData.amount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改资产数据"
      :visible.sync="dialogShow2"
      width="500px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户名" prop="title">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="title">
          <el-input v-model="updateForm.coin" disabled></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="num">
          <el-input v-model="updateForm.num"></el-input>
        </el-form-item>
        <el-form-item label="冰结" prop="frozen">
          <el-input v-model="updateForm.frozen"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="app-container">
      <div style="font-size: 14px;padding-bottom: 10px;font-weight: bold;">总数量：{{totalNum}}</div>
      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          prop="username"
          fixed="left"
          label="用户名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="coin"
          label="币种"
          align="center"
          fixed="left"
          width="80">
        </el-table-column>
        <el-table-column
          prop="num"
          label="余额"
          width="120">
        </el-table-column>
        <el-table-column
          prop="frozen"
          label="冻结"
          width="120">
        </el-table-column>
        <el-table-column
          prop="licai"
          label="理财账户"
          width="120">
        </el-table-column>
        <el-table-column
          prop="recharge_addr"
          label="TRC20地址"
          min-width="300"
          align="center">
        </el-table-column>
        <el-table-column
          prop="erc_addr"
          label="ERC20地址"
          min-width="300"
          align="center">
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updated_at"
          width="160"
          label="最后修改">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="280">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleAdd(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleUpdate(row)">修改</el-button>
            <el-button type="danger" size="small" @click="onDeleteAddr(row.id)">清除充值地址</el-button>
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
import {getList,getListTotal,coinAdd,clearAddr,clearList,coinUpdate} from '@/api/usercoin'

export default {
  name: 'usercoin',
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
        id:0,
        username:'',
        num:'',
        frozen:''
      },
      formLine:{
        name:'',
        from_user:'',
        coin_id:'',
        min:'',
        max:'',
        licai_min:'',
        licai_max:'',
        white:''
      },
      coinList:[],
      selectList:[],
      totalNum:0
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
        +"&name="+this.formLine.name+"&coin_id="+this.formLine.coin_id
        +"&min="+this.formLine.min+"&max="+this.formLine.max
        +"&licai_min="+this.formLine.licai_min+"&licai_max="+this.formLine.licai_max
        +"&white="+this.formLine.white;
      this.loading = true;
      getListTotal(param).then(res=>{
        this.totalNum = res.data
      })
      getList(param).then(res=>{
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
    handleCancel2(){
      this.dialogShow2 = false;
    },
    handleAdd(row){
      this.dialogShow = true;
      if(row){
        this.formData.username = row.username;
        this.formData.coin_id = row.coin_id;
      }
    },
    handleUpdate(row){
      this.dialogShow2 = true;
      if(row){
        this.updateForm = {
          id:row.id,
          username:row.username,
          coin:row.coin,
          num:row.num,
          frozen: row.frozen
        };
      }
    },
    resetForm(){
      this.formData = {
        username:'',
        coin_id:'',
        amount:''
      }
    },
    onSubmitAdd(){
      coinAdd(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitUpdate(){
      coinUpdate(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
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
    onDeleteAddr(id){
      this.$confirm('是否清除此条数据中的充值地址？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearAddr(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    handleSelectionChange(val){
      this.selectList = [];
      for(var i=0;i<val.length;i++){
        this.selectList.push(val[i].id);
      }
    },
    onDeleteList(){
      this.$confirm('是否清除所选择数据的充值地址？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         clearList(this.selectList).then(res=>{
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

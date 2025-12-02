<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="商户名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加商户</el-button>
    </div>
    <el-dialog
      title="添加商户"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="币种名称" prop="coin_name">
          <el-input v-model="formData.coin_name"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payment">
          <el-checkbox-group v-model="formData.payment">
            <el-checkbox label="支付宝"></el-checkbox>
            <el-checkbox label="微信"></el-checkbox>
            <el-checkbox label="银行卡"></el-checkbox>>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="保证金" prop="bond">
          <el-input v-model="formData.bond"></el-input>
        </el-form-item>
        <el-form-item label="最低金额" prop="min">
          <el-input v-model="formData.min"></el-input>
        </el-form-item>
        <el-form-item label="最高金额" prop="max">
          <el-input v-model="formData.max"></el-input>
        </el-form-item>
        <el-form-item label="浮动价格" prop="float_price">
          <el-input v-model="formData.float_price"></el-input>
        </el-form-item>
        <el-form-item label="卖币商家" prop="is_sell">
          <el-switch v-model="formData.is_sell" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="买币商家" prop="is_buy">
          <el-switch v-model="formData.is_buy" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改商户信息"
      :visible.sync="dialogShow2"
      width="500px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="币种名称" prop="coin_name">
          <el-input v-model="updateForm.coin_name"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payment">
          <el-checkbox-group v-model="updateForm.payment">
            <el-checkbox label="支付宝"></el-checkbox>
            <el-checkbox label="微信"></el-checkbox>
            <el-checkbox label="银行卡"></el-checkbox>>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="保证金" prop="bond">
          <el-input v-model="updateForm.bond"></el-input>
        </el-form-item>
        <el-form-item label="最低金额" prop="min">
          <el-input v-model="updateForm.min"></el-input>
        </el-form-item>
        <el-form-item label="最高金额" prop="max">
          <el-input v-model="updateForm.max"></el-input>
        </el-form-item>
        <el-form-item label="浮动价格" prop="float_price">
          <el-input v-model="updateForm.float_price"></el-input>
        </el-form-item>
        <el-form-item label="卖币商家" prop="is_sell">
          <el-switch v-model="updateForm.is_sell" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="买币商家" prop="is_buy">
          <el-switch v-model="updateForm.is_buy" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商户名称"
          min-width="200">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="headers"
                :data="scope.row"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :on-error="handelLogoError">
                 <img v-if="scope.row.logo" :src="scope.row.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="margin-left: 10px;">{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="coin_name"
          label="币种"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="payment"
          label="支付方式"
          align="center"
          width="120">
          <template slot-scope="{row}">
            <el-tag v-for="(item,index) in row.payment" :key="index" style="margin:5px;">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="bond"
          label="保证金"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="float_price"
          label="浮动价格"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="price"
          label="当前价格"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="min"
          label="最低金额"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="max"
          label="最高金额"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="is_sell"
          label="卖币商家"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.is_sell">是</el-tag>
            <el-tag type="info" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_buy"
          label="买币商家"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.is_buy">是</el-tag>
            <el-tag type="info" v-else>否</el-tag>
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
          width="150">
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
          :total="meta.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getList,addShop,updateShop,deleteShop} from '@/api/shop'
import { getToken } from '@/utils/auth'

export default {
  name: 'shop',
  data(){
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + 'shop/upload/logo',
      headers:{
        Authorization:'Bearer '+getToken()
      },
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
        name:'',
        coin_name:'',
        payment:[],
        bond:'',
        min:'',
        max:'',
        float_price:'',
        is_sell:1,
        is_buy:1
      },
      updateForm:{

      },
      formLine:{
        name:''
      },
      selectList:[]
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
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&name="+this.formLine.name;
      this.loading = true;
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
      this.updateForm = {};
    },
    handleAdd(){
      this.dialogShow = true;
    },
    handleEdit(row){
      this.updateForm = {};
      this.updateForm = {
        id:row.id,
        name:row.name,
        coin_name:row.coin_name,
        payment:row.payment,
        bond:row.bond,
        min:row.min,
        max:row.max,
        float_price:row.float_price,
        is_sell:row.is_sell,
        is_buy:row.is_buy
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        name:'',
        coin_name:'',
        payment:[],
        bond:'',
        min:'',
        max:'',
        float_price:'',
        is_sell:1,
        is_buy:1
      }
    },
    onSubmitAdd(){
      addShop(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateShop(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此商户删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteShop(id).then(res=>{
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
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
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
    }
  }
}
</script>

<style scoped>

</style>

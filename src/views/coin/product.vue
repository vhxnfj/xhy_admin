<script src="../../../../../caipiao/admin/src/router/index.js"></script>
<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="产品标题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加产品</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
    </div>
    <el-dialog
      title="添加产品"
      :visible.sync="dialogShow"
      width="650px">
      <el-form :model="formData" ref="infoForm" label-width="100px" >
        <el-form-item label="产品标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="时间周期" prop="start_at">
          <el-date-picker
            v-model="formData.start_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="formData.end_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="初始价格" prop="init_price">
          <el-input v-model="formData.init_price" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="价格区间" prop="start_price">
          <el-input v-model="formData.start_price" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.end_price" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="价格变动频率" prop="time">
          <el-input v-model="formData.time" style="width: 100px;"></el-input> 分/次
        </el-form-item>
        <el-form-item label="浮动范围" prop="start_change">
          <el-input v-model="formData.start_change" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.end_change" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="最低买入量" prop="buy_list">
          <el-input v-model="formData.buy_limit" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="允许买入" prop="is_buy">
          <el-switch v-model="formData.is_buy"></el-switch>
        </el-form-item>
        <el-form-item label="允许卖出" prop="is_sell">
          <el-switch v-model="formData.is_sell"></el-switch>
        </el-form-item>
        <el-form-item label="排列顺序" prop="sort_num">
          <el-input v-model="formData.sort_num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
        <el-form-item label="期限" prop="options">
          <div v-for="(item,index) in formData.options" style="padding-bottom: 10px;">
            <el-input v-model="item.num" style="width:100px;"></el-input>
            <el-select v-model="item.type" placeholder="请选择" style="width: 100px;">
              <el-option
                v-for="_item in options"
                :key="_item.value"
                :label="_item.label"
                :value="_item.value">
              </el-option>
            </el-select>
            <el-button type="danger" size="small" @click="onDeleteRow(formData,index)">删除</el-button>
          </div>
          <div>
            <el-button type="success" icon="el-icon-plus" @click="onAddRow(formData)">新增期限</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改产品信息"
      :visible.sync="dialogShow2"
      width="650px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px">
        <el-form-item label="产品标题" prop="title">
          <el-input v-model="updateForm.title"></el-input>
        </el-form-item>
        <el-form-item label="时间周期" prop="start_at">
          <el-date-picker
            v-model="updateForm.start_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="updateForm.end_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="初始价格" prop="init_price">
          <el-input v-model="updateForm.init_price" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="价格区间" prop="start_price">
          <el-input v-model="updateForm.start_price" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.end_price" style="width: 100px;"></el-input>
          当前价格为：<span style="color: red;">{{updateForm.price}}</span>
        </el-form-item>
        <el-form-item label="价格变动频率" prop="time">
          <el-input v-model="updateForm.time" style="width: 100px;"></el-input> 分/次
        </el-form-item>
        <el-form-item label="浮动范围" prop="start_change">
          <el-input v-model="updateForm.start_change" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.end_change" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="最低买入量" prop="buy_list">
          <el-input v-model="updateForm.buy_limit" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="允许买入" prop="is_buy">
          <el-switch v-model="updateForm.is_buy"></el-switch>
        </el-form-item>
        <el-form-item label="允许卖出" prop="is_sell">
          <el-switch v-model="updateForm.is_sell"></el-switch>
        </el-form-item>
        <el-form-item label="排列顺序" prop="sort_num">
          <el-input v-model="updateForm.sort_num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="updateForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="期限" prop="options">
          <div v-for="(item,index) in updateForm.options" style="padding-bottom: 10px;">
            <el-input v-model="item.num" style="width:100px;"></el-input>
            <el-select v-model="item.type" placeholder="请选择" style="width: 100px;">
              <el-option
                v-for="_item in options"
                :key="_item.value"
                :label="_item.label"
                :value="_item.value">
              </el-option>
            </el-select>
            <el-button type="danger" size="small" @click="onDeleteRow(updateForm,index)">删除</el-button>
          </div>
          <div>
            <el-button type="success" icon="el-icon-plus" @click="onAddRow(updateForm)">新增期限</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有类型</el-radio-button>
          <el-radio-button label="1">已停用</el-radio-button>
          <el-radio-button label="2">启用中</el-radio-button>
        </el-radio-group>
      </div>

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
          prop="logo"
          label="图标"
          width="80"
          fixed="left">
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
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="产品标题"
          fixed="left"
          min-width="150">
          <template slot-scope="{row}">
            <div style="font-weight: bold;">{{row.title}}</div>
            <div style="color: #929191;">
              <span v-for="(item,index) in row.options">{{ (index>0 ? '/' : '')+item.num}}{{optionValue[item.type]}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="时间周期">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">开始时间：</div><div>{{row.start_at}}</div>
            <div style="font-size: 12px;color: #42b983;">结束时间：</div><div>{{row.end_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="init_price"
          label="初始价格"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="price"
          label="当前价格"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="parent_reward"
          label="价格区间"
          align="center"
          width="150">
          <template slot-scope="{row}">
            {{row.start_price}} - {{row.end_price}}
          </template>
        </el-table-column>
        <el-table-column
          prop="parent_reward"
          label="浮动范围"
          align="center"
          width="150">
          <template slot-scope="{row}">
            {{row.start_change}} - {{row.end_change}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="parent_reward"
          label="变动频率"
          align="center"
          width="80">
          <template slot-scope="{row}">
            {{row.time}}分/次
          </template>
        </el-table-column>
        <el-table-column
          prop="buy_limit"
          label="最低买入"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="sort_num"
          label="排序"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="is_buy"
          label="买入"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.is_buy">开启</el-tag>
            <el-tag type="info" v-else>关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_sell"
          label="卖出"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.is_sell">开启</el-tag>
            <el-tag type="info" v-else>关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="启用状态"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status" @change="stopChange(row)">
            </el-switch>
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
import {coinSelectList, openTransfer, stopTransfer} from '@/api/coin'
import {getList,addProduct,updateProduct,deleteProduct,deleteListProduct,stop,open,stopList,openList} from '@/api/coinproduct'
import ScrollPane from "@/layout/components/TagsView/ScrollPane";
import {getToken} from "@/utils/auth";

export default {
  name: 'product',
  components: {ScrollPane},
  data(){
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + 'coinproduct/upload/logo',
      headers:{
        Authorization:'Bearer '+getToken()
      },
      options:[
        {
          value:'i',
          label:'分'
        },
        {
          value:'d',
          label:'天'
        }
      ],
      optionValue:{
        'i':'分',
        'd':'天'
      },
      dialogShow:false,
      dialogShow2:false,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'0',
      loading:false,
      formData:{
        title:'',
        init_price:'',
        start_at:'',
        end_at:'',
        start_price:'',
        end_price:'',
        time:'',
        start_change:'',
        end_change:'',
        buy_limit:'',
        is_buy:true,
        is_sell:true,
        options:[],
        sort_num:'',
        status:true
      },
      updateForm:{

      },
      formLine:{
        name:''
      },
      coinList:[],
      selectList:[]
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
        +"&name="+this.formLine.name+"&status="+this.activeType;
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
      this.updateForm = {
        id:row.id,
        title:row.title,
        price:row.end_price,
        init_price:row.init_price,
        start_at:row.start_at,
        end_at:row.end_at,
        start_price:row.start_price,
        end_price:row.end_price,
        time:row.time,
        start_change:row.start_change,
        end_change:row.end_change,
        buy_limit:row.buy_limit,
        is_buy:row.is_buy,
        is_sell:row.is_sell,
        options:row.options,
        sort_num:row.sort_num,
        status:row.status
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        title:'',
        init_price:'',
        start_at:'',
        end_at:'',
        start_price:'',
        end_price:'',
        time:'',
        start_change:'',
        end_change:'',
        buy_limit:'',
        is_buy:true,
        is_sell:true,
        options:[],
        sort_num:'',
        status:true
      }
    },
    onAddRow(form){
      form.options.push({
        num:'',
        type:''
      });
    },
    onDeleteRow(form,index){
      form.options.splice(index, 1);
    },
    onSubmitAdd(){
      addProduct(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateProduct(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此产品删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(id).then(res=>{
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
    onDeleteList(){
      this.$confirm('是否删除所选择的产品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListProduct(this.selectList).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    stopChange(row){
      if(row.status){
        open(row.id).then(res=>{
          this.$message.success(res.message);
          this.getList();
        }).catch(error=>{
          row.is_stop = false
        })
      }else{
        stop(row.id).then(res=>{
          this.$message.success(res.message);
          this.getList();
        }).catch(error=>{
          row.is_stop = true
        })
      }
    },
    stopList(){
      stopList(this.selectList).then(res=>{
        this.$message.success(res.message);
        this.getList();
      })
    },
    openList(){
      openList(this.selectList).then(res=>{
        this.$message.success(res.message);
        this.getList();
      })
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
    transferChange(row){
      if(row.is_transfer){
        openTransfer(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_transfer = false
        })
      }else{
        stopTransfer(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_transfer = true
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

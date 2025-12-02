<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="矿机名称/型号" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="formLine.coin_id" style="width: 120px;" placeholder="请选择" clearable>
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加矿机</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
    </div>
    <el-dialog
      title="添加矿机"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="矿机名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="矿机型号" prop="model">
          <el-input v-model="formData.model"></el-input>
        </el-form-item>
        <el-form-item label="购买价格" prop="price">
          <el-input v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="生产币种" prop="coin_type">
          <el-select v-model="formData.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产生收益" prop="profit">
          <el-input v-model="formData.profit"></el-input>
        </el-form-item>
        <el-form-item label="收益率" prop="profit_rate">
          <el-input v-model="formData.profit_rate"></el-input>
        </el-form-item>
        <el-form-item label="矿机算力" prop="calcu">
          <el-input v-model="formData.calcu"></el-input>
        </el-form-item>
        <el-form-item label="运行天数" prop="days">
          <el-input v-model="formData.days"></el-input>
        </el-form-item>
        <el-form-item label="发行数量" prop="total_num">
          <el-input v-model="formData.total_num"></el-input>
        </el-form-item>
        <el-form-item label="卖出数量" prop="selled_num">
          <el-input v-model="formData.selled_num"></el-input>
        </el-form-item>
        <el-form-item label="购买限制" prop="buy_limit">
          <el-input v-model="formData.buy_limit">台/人，不填或填0表示不限制</el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="sort_num">
          <el-input v-model="formData.sort_num"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改矿机信息"
      :visible.sync="dialogShow2"
      width="500px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="矿机名称" prop="title">
          <el-input v-model="updateForm.title"></el-input>
        </el-form-item>
        <el-form-item label="矿机型号" prop="model">
          <el-input v-model="updateForm.model"></el-input>
        </el-form-item>
        <el-form-item label="购买价格" prop="price">
          <el-input v-model="updateForm.price"></el-input>
        </el-form-item>
        <el-form-item label="生产币种" prop="coin_type">
          <el-select v-model="updateForm.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产生收益" prop="profit">
          <el-input v-model="updateForm.profit"></el-input>
        </el-form-item>
        <el-form-item label="收益率" prop="profit_rate">
          <el-input v-model="updateForm.profit_rate"></el-input>
        </el-form-item>
        <el-form-item label="矿机算力" prop="calcu">
          <el-input v-model="updateForm.calcu"></el-input>
        </el-form-item>
        <el-form-item label="运行天数" prop="days">
          <el-input v-model="updateForm.days"></el-input>
        </el-form-item>
        <el-form-item label="发行数量" prop="total_num">
          <el-input v-model="updateForm.total_num"></el-input>
        </el-form-item>
        <el-form-item label="卖出数量" prop="selled_num">
          <el-input v-model="updateForm.selled_num"></el-input>
        </el-form-item>
        <el-form-item label="购买限制" prop="buy_limit">
          <el-input v-model="updateForm.buy_limit">台/人，不填或填0表示不限制</el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="phone">
          <el-input v-model="updateForm.sort_num"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="updateForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="生成兑换码"
      :visible.sync="dialogShow3"
      width="400px">
      <el-form :model="exchangeForm" ref="infoForm" label-width="100px" style="width: 300px;">
        <el-form-item label="生成数量" prop="title">
          <el-input v-model="exchangeForm.count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel3()">取 消</el-button>
        <el-button type="primary" @click="onSubmitExchange">确 定</el-button>
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
          prop="title"
          label="矿机名称"
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
              <span style="margin-left: 10px;">{{scope.row.title}}({{scope.row.model}})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="coinName"
          label="生产币种"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="profit"
          label="生产币数"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="profit_rate"
          label="收益率(%)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="calcu"
          label="算力(h)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="days"
          label="运行时间(天)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="total_num"
          label="发行总量(台)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="selled_num"
          label="已卖出(台)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="buy_limit"
          label="购买限制"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <span v-if="row.buy_limit>0">{{row.buy_limit}}台/人</span>
            <span v-else>不限制</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort_num"
          label="排序"
          align="center"
          width="80">
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
          width="260">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
            <el-button type="warning" size="small" @click="onExchange(row.id)">生成兑换码</el-button>
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
import {getList, addMiner, updateMiner, deleteMiner, deleteListMiner, stop, open, stopList, openList, createExchange} from '@/api/miner'
import { getToken } from '@/utils/auth'

export default {
  name: 'miner',
  data(){
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + 'miner/upload/logo',
      headers:{
        Authorization:'Bearer '+getToken()
      },
      coinList:[],
      dialogShow:false,
      dialogShow2:false,
      dialogShow3:false,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'-1',
      loading:false,
      formData:{
        title:'',
        coin_id:'',
        model:'',
        price:'',
        profit:'',
        profit_rate:'',
        miner_type:'',
        calcu:'',
        days:'',
        sort_num:'',
        buy_limit:'',
        total_num:'',
        selled_num:'',
        status:true
      },
      updateForm:{

      },
      exchangeForm:{
        id:'',
        count:''
      },
      formLine:{
        name:'',
        coin_id:''
      },
      selectList:[],
      typeList:[
        {
          value:0,
          label:"普通矿机"
        },
        {
          value:1,
          label:"平台币矿机"
        }
      ]
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
    onExchange(id){
      this.dialogShow3 = true;
      this.exchangeForm.id = id;
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&name="+this.formLine.name+"&coin_id="+this.formLine.coin_id;
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
    handleCancel3(){
      this.dialogShow3 = false;
      this.exchangeForm = {id:'',count: ''};
    },
    handleAdd(){
      this.dialogShow = true;
    },
    handleEdit(row){
      this.updateForm = {
        id:row.id,
        coin_id:row.coin_id,
        title:row.title,
        model:row.model,
        price:row.price,
        profit:row.profit,
        profit_rate:row.profit_rate,
        miner_type:row.miner_type,
        calcu:row.calcu,
        days:row.days,
        total_num:row.total_num,
        selled_num:row.selled_num,
        buy_limit:row.buy_limit,
        sort_num:row.sort_num,
        status:row.status
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        title:'',
        coin_id:'',
        model:'',
        price:'',
        profit:'',
        profit_rate:'',
        miner_type:'',
        calcu:'',
        days:'',
        total_num:'',
        selled_num:'',
        buy_limit:'',
        sort_num:'',
        status:true
      }
    },
    onSubmitAdd(){
      addMiner(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateMiner(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitExchange(){
      createExchange(this.exchangeForm).then(res=>{
        this.handleCancel3();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此矿机删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMiner(id).then(res=>{
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
      this.$confirm('是否删除所选择的矿机？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListMiner(this.selectList).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    stopChange(row){
      if(row.status){
        open(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.status = false
        })
      }else{
        stop(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.status = true
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
    }
  }
}
</script>

<style scoped>

</style>

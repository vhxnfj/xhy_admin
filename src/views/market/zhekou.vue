<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="输入关键词" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" round>添加活动</el-button>
      <span style="margin-left: 20px;font-size: 12px;color: #999999;">app页面 <el-tag size="mini">/pages/zhekou/zhekou?id=<span style="color: #f4516c;">ID号</span></el-tag></span>
    </div>
    <el-dialog
      title="抽奖活动"
      :visible.sync="dialogShow"
      width="700px">
      <el-form :model="dataForm" ref="moneyForm" label-width="100px" style="width: 600px;">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="created_at">
          <el-date-picker
            v-model="dataForm.start_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="created_at">
          <el-date-picker
            v-model="dataForm.end_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抽奖价格" prop="price">
          <el-input v-model="dataForm.price" style="width: 100px"></el-input> U/次，0或小于0表示免费抽取
        </el-form-item>
        <el-form-item label="免费次数" prop="free_times">
          <el-input v-model="dataForm.free_times" style="width: 100px"></el-input> 次/天
        </el-form-item>
        <el-form-item label="中奖概率" prop="bonus_chance">
          <el-input v-model="dataForm.bonus_chance" style="width: 100px"></el-input> %
        </el-form-item>
        <el-form-item label="奖励制度">
          <div style="padding:5px;" v-for="(item,index) in dataForm.bonus_nodes">
            <el-input v-model="item.zhekou" style="width: 100px"></el-input>折优惠
            <el-button @click="deleteBonus(index,dataForm.bonus_nodes)" type="danger" size="small">删除</el-button>
          </div>
          <div>
            <el-button @click="addBonusRule()">添加规则</el-button>
          </div>
        </el-form-item>
        <el-form-item label="活动说明" prop="info">
          <el-input v-model="dataForm.info" type="textarea" :rows="10"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch v-model="dataForm.status" :active-value="1" :inactive-value="0"></el-switch>
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
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="80"
          fixed="left"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="title"
          min-width="160"
          fixed="left"
          label="活动标题">
        </el-table-column>
        <el-table-column
          prop="start_at"
          width="160"
          label="活动时间">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">开始时间：</div><div>{{row.start_at}}</div>
            <div style="font-size: 12px;color: #42b983;">结束时间：</div><div>{{row.end_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="参与价格">
          <template slot-scope="{row}">
            {{row.price}} USDT
          </template>
        </el-table-column>
        <el-table-column
          prop="free_times"
          label="免费次/天">
        </el-table-column>
        <el-table-column
          prop="bonus_chance"
          label="中奖概率">
          <template slot-scope="{row}">
            {{row.bonus_chance}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.status">启用</el-tag>
            <el-tag type="info" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="时间"
          width="160">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">创建时间：</div><div>{{row.created_at}}</div>
            <div style="font-size: 12px;color: #42b983;">最后修改：</div><div>{{row.updated_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          width="260"
          label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
            <el-button size="small" @click="onRecord(row.id)">领取记录</el-button>
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
    <el-dialog title="活动领取记录" width="800px" :visible.sync="dialogTableVisible">
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="记录统计">
            <div style="width: 200px;">参与次数：{{meta_r.total}}次</div>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="formRecordLine.username" style="width: 150px;" placeholder="输入用户名" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formRecordLine.status" style="width: 120px;" clearable placeholder="请选择">
              <el-option value="1" label="未使用"></el-option>
              <el-option value="2" label="已使用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchRecords()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="gridData" v-loading="gridLoading">
        <el-table-column property="username" label="用户名" width="180"></el-table-column>
        <el-table-column property="coin" label="币种"></el-table-column>
        <el-table-column property="price" label="参与价格" width="100"></el-table-column>
        <el-table-column property="free_rate" label="折扣" width="100"></el-table-column>
        <el-table-column property="status" label="状态" width="100">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.status">已使用</el-tag>
            <el-tag type="info" v-else>未使用</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="created_at" label="领取时间" width="180"></el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagesize_r"
          @size-change="handleSizeRChange"
          @current-change="handleCurrentRChange"
          :current-page.sync="page_r"
          :total="meta_r.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {coinSelectList} from '@/api/coin'
import {getList,addZhekou,updateZhekou,deleteZhekou,getRecords} from '@/api/zhekou'

export default {
  name: 'zhekou',
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
      page_r:1,
      pagesize_r:20,
      meta_r:{
        total:0
      },
      activeType:'0',
      loading:false,
      dialogShow:false,
      submiting:false,
      dataForm:{

      },
      dialogTableVisible:false,
      gridData:[],
      gridLoading:false,
      record_id:0,
      formRecordLine:{
        username:'',
        status:''
      }
    }
  },
  created() {
    if(this.$route.query.username){
      this.formLine.username = this.$route.query.username;
    }
    this.getList();
    this.getCoinList();
  },
  activated() {
    this.getCoinList();
  },
  computed:{
    tongji_amount(){
      var list = this.gridData,total = 0.0;
      list.forEach(item=>{
        if(item.coin == 'USDT'){
          total += item.amount;
        }
      })
      return Math.round(total*100000000)/100000000;
    }
  },
  methods:{
    addBonusRule(){
      this.dataForm.bonus_nodes.push({zhekou:''});
    },
    deleteBonus(index,data){
      data.splice(index,1);
    },
    addGiftRule(){
      this.dataForm.gift_nodes.push({start_num:'',end_num:'',coin_id:''});
    },
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
      var param = 'page='+this.page+"&pagesize="+this.pagesize +"&keyword="+this.formLine.keyword;
      this.loading = true;
      getList(param).then(res=>{
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
    handleSizeRChange(val) {
      this.pagesize_r = val;
      this.onRecord(this.record_id);
    },
    handleCurrentRChange(val) {
      this.page_r = val;
      this.onRecord(this.record_id);
    },
    searchRecords(){
      this.page_r = 1;
      this.meta_r = {
        total: 0
      }
      this.onRecord(this.record_id);
    },
    onRecord(id){
      if(id != this.record_id){
        this.page_r = 1;
        this.meta_r = {
          total: 0
        }
      }
      this.record_id = id;
      this.dialogTableVisible = true;
      this.gridData = [];
      this.gridLoading = true;
      var params = "id="+id+"&page="+this.page_r+"&pagesize="+this.pagesize_r+"&username="+this.formRecordLine.username+"&status="+this.formRecordLine.status;

      getRecords(params).then(res=>{
        this.gridLoading = false;
        this.gridData = res.data;
        this.meta_r = res.meta;
      }).catch(error =>{
        this.gridLoading = false;
      })
    },
    handleAdd(){
      this.dataForm = {
        title:'',
        start_at:'',
        end_at:'',
        price:'',
        free_times:'',
        bonus_chance:'',
        bonus_nodes:[],
        info:'',
        status:1
      };
      this.dialogShow = true;
    },
    handleEdit(row){
      this.dataForm = {
        id:row.id,
        title:row.title,
        price:row.price,
        start_at:row.start_at,
        end_at:row.end_at,
        free_times:row.free_times,
        bonus_chance:row.bonus_chance,
        bonus_nodes:row.bonus_nodes,
        info:row.info,
        status:row.status
      };
      this.dialogShow = true;
    },
    onChangeStatus(row){
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
    onDelete(id){
      this.$confirm('是否删除此活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteZhekou(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    onSubmit(){
      this.submiting = true;
      if(this.dataForm.id){
        updateZhekou(this.dataForm).then(res=>{
          this.submiting = false;
          this.dialogShow = false;
          this.getList();
          this.$message.success(res.message);
        }).catch(error=>{
          this.submiting = false;
        });
      }else{
        addZhekou(this.dataForm).then(res=>{
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

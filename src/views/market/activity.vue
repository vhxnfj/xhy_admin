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
      <span style="margin-left: 20px;font-size: 12px;color: #999999;">app页面/pages/activity/activity?id=ID号</span>
    </div>
    <el-dialog
      title="红包活动"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="dataForm" ref="moneyForm" label-width="100px" style="width: 500px;">
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
        <el-form-item label="红包数量" prop="total_num">
          <el-input v-model="dataForm.total_num" style="width: 100px"></el-input> 个
        </el-form-item>
        <el-form-item label="每人可领" prop="max_num">
          <el-input v-model="dataForm.max_num" style="width: 100px"></el-input> 个
        </el-form-item>
        <el-form-item label="红包总额" prop="total_amount">
          <el-input v-model="dataForm.total_amount" style="width: 100px"></el-input>
          <el-select v-model="dataForm.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大红包金额" prop="total_amount">
          <el-input v-model="dataForm.max_amount" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="已领数量" prop="get_num">
          <el-input v-model="dataForm.get_num" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="已领币数" prop="get_amount">
          <el-input v-model="dataForm.get_amount" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="每隔" prop="get_time">
          <el-input v-model="dataForm.get_time" style="width: 180px"></el-input> 分钟，可领取一次
        </el-form-item>
        <el-form-item label="红包类型" prop="is_top">
          <el-radio v-model="dataForm.type" :label="0">随机红包</el-radio>
          <el-radio v-model="dataForm.type" :label="1">固定金额</el-radio>
        </el-form-item>
        <el-form-item label="启用状态" prop="is_popup">
          <el-switch v-model="dataForm.status"></el-switch>
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
          prop="total_num"
          label="红包数量">
        </el-table-column>
        <el-table-column
          prop="max_num"
          label="每人可领">
          <template slot-scope="{row}">
            {{row.max_num}}个
          </template>
        </el-table-column>
        <el-table-column
          prop="total_amount"
          width="180"
          label="发布总额">
          <template slot-scope="{row}">
            {{row.total_amount}}{{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="红包类型">
          <template slot-scope="{row}">
            {{row.type == 1 ? '固定金额' : '随机红包'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="total_amount"
          width="120"
          label="最大红包">
          <template slot-scope="{row}">
            {{row.max_amount}}{{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="get_num"
          label="已领数量">
        </el-table-column>
        <el-table-column
          prop="get_amount"
          width="180"
          label="已领金额">
          <template slot-scope="{row}">
            {{row.get_amount}}{{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="get_time"
          width="80"
          label="时间间隔">
          <template slot-scope="{row}">
            {{row.get_time}}分钟
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="启用">
          <template slot-scope="{row}">
            <el-switch @change="onChangeStatus(row)" v-model="row.status"></el-switch>
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
    <el-dialog title="红包领取记录" width="650px" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" v-loading="gridLoading">
        <el-table-column property="name" label="昵称" width="140"></el-table-column>
        <el-table-column property="username" label="用户名" width="180"></el-table-column>
        <el-table-column property="amount" label="领取金额"></el-table-column>
        <el-table-column property="created_at" label="领取时间" width="180"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {coinSelectList} from '@/api/coin'
  import {getList,addActivity,updateActivity,deleteActivity,open,stop,getRecords} from '@/api/activity'
  import errorLog from "@/store/modules/errorLog";

  export default {
    name: 'activity',
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
        activeType:'0',
        loading:false,
        dialogShow:false,
        submiting:false,
        dataForm:{

        },
        dialogTableVisible:false,
        gridData:[],
        gridLoading:false
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
      onRecord(id){
        this.dialogTableVisible = true;
        this.gridData = [];
        this.gridLoading = true;
        getRecords(id).then(res=>{
          this.gridLoading = false;
          this.gridData = res.data;
        }).catch(error =>{
          this.gridLoading = false;
        })
      },
      handleAdd(){
        this.dataForm = {
          title:'',
          start_at:'',
          end_at:'',
          coin_id:'',
          total_num:'',
          max_num:'',
          total_amount:'',
          max_amount:'',
          get_amount:'0',
          get_num:'0',
          get_time:'0',
          type:0,
          status:true
        };
        this.dialogShow = true;
      },
      handleEdit(row){
        this.dataForm = {
          id:row.id,
          title:row.title,
          start_at:row.start_at,
          end_at:row.end_at,
          coin_id:row.coin_id,
          total_num:row.total_num,
          max_num:row.max_num,
          total_amount:row.total_amount,
          max_amount:row.max_amount,
          get_amount:row.get_amount,
          get_num:row.get_num,
          get_time:row.get_time,
          type:row.type,
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
          deleteActivity(id).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.dataForm.id){
          updateActivity(this.dataForm).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.getList();
            this.$message.success(res.message);
          }).catch(error=>{
            this.submiting = false;
          });
        }else{
          addActivity(this.dataForm).then(res=>{
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

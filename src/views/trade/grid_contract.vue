<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.order_no" placeholder="流水号" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.name" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="投资">
          <el-input v-model="formLine.min" style="width: 100px;" placeholder="数字" clearable></el-input>
          -
          <el-input v-model="formLine.max" style="width: 100px;" placeholder="数字" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种类型" prop="coin_type">
          <el-select v-model="formLine.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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

    <el-dialog
      title="执行策略"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 500px;">
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="username">
          <el-date-picker
            v-model="formData.date"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买金额" prop="buy_price">
          <el-input v-model="formData.min_buy_price" style="width: 140px;"></el-input>
          -
          <el-input v-model="formData.max_buy_price" style="width: 140px;"></el-input>
        </el-form-item>
        <el-form-item label="限价区间" prop="max_count">
          <el-input v-model="formData.min_price" style="width: 140px;"></el-input>
          -
          <el-input v-model="formData.max_price" style="width: 140px;"></el-input>
        </el-form-item>
        <el-form-item label="购买限量" prop="max_count">
          <el-input v-model="formData.min_count" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.max_count" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="杠杆倍数 " prop="lever_num">
          <el-input v-model="formData.min_lever" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.max_lever" style="width: 100px;"></el-input>
          倍
        </el-form-item>
        <el-form-item label="挂单模式" prop="type">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盈利范围" prop="return_rate">
          <el-input v-model="formData.return_start_rate" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.return_end_rate" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="亏损范围" prop="return_rate">
          <el-input v-model="formData.loss_start_rate" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.loss_end_rate" style="width: 100px;"></el-input>
          %
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button :loading="submiting" :disabled="submiting" type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <div class="toolbar-box">
      <el-button type="primary" @click="handleDogrid" round>执行策略</el-button>
    </div>

    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="formLine.status" @change="handleClickTab">
          <el-radio-button label="0">全部</el-radio-button>
          <el-radio-button :label="item.value" v-for="(item,index) in options" :key="index">{{item.label}}</el-radio-button>
        </el-radio-group>
      </div>

      <div style="padding: 20px;background: #f1f1f1;">
        订单总量：<b>{{tongji.total}}</b>，进行中：<b>{{tongji.runing}}</b>，已完成：<b>{{tongji.success}}</b>，收益：<b>{{tongji.totalReward}}</b>
      </div>

      <el-table
        :data="tableData"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="流水号"
          align="center"
          fixed="left"
          width="180">
        </el-table-column>
        <el-table-column
          prop="coin"
          label="币种"
          fixed="left"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="投资币数"
          align="center"
          width="140">
          <template slot-scope="{row}">
            {{row.amount}} {{row.trade_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="手续费"
          align="center"
          width="140">
          <template slot-scope="{row}">
            {{row.fee}} {{row.trade_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="网格数量"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="lever_num"
          label="倍数"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="profit"
          label="收益"
          align="center"
          width="150">
          <template slot-scope="{row}">
            <span :style="{color:row.flag ? 'green' : 'red'}">{{row.flag ? '+' : ''}}{{row.profit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="profit_rate"
          label="收益率"
          align="center"
          width="100">
          <template slot-scope="{row}">
            {{row.profit_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="区间价格"
          align="center"
          width="200">
          <template slot-scope="{row}">
            {{row.low_price}} - {{row.up_price}} {{row.trade_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="modeName"
          label="挂单模式"
          align="center"
          fixed="right"
          width="80">
          <template slot-scope="{row}">
            <el-tag type="danger" v-if="row.type==1" effect="dark">{{row.modeName}}</el-tag>
            <el-tag type="success" effect="dark" v-else>{{row.modeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          align="center"
          fixed="right"
          width="80">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==0">{{row.statusName}}</el-tag>
            <el-tag type="success" v-else-if="row.status==1">{{row.statusName}}</el-tag>
            <el-tag type="info" v-else>{{row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          fixed="right"
          label="下单时间">
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
import { getList,getTongji,doGrid } from '@/api/grid_contract'

export default {
  name: 'grid_contract',
  data(){
    return {
      dialogShow:false,
      props:{
        label: 'title',
        children: 'children',
        isLeaf: 'leaf'
      },
      treeData:[],
      nowRow:null,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'0',
      loading:false,
      submiting:false,
      formData:{
        name:'',
        date:[],
        min_buy_price:'',
        max_buy_price:'',
        min_price:'',
        max_price:'',
        min_count:'',
        max_count:'',
        min_lever:'',
        max_lever:'',
        type:0,
        return_start_rate:'',
        return_end_rate:'',
        loss_start_rate:'',
        loss_end_rate:''
      },
      formLine:{
        order_no:'',
        name:'',
        days:'',
        coin_id:'',
        min:'',
        max:'',
        status:0,
        date:null
      },
      selectList:[],
      options: [{
        value: '1',
        label: '进行中'
      }, {
        value: '2',
        label: '已完成'
      }],
      typeList:[
        {
          value:0,
          label: '做多'
        },
        {
          value:1,
          label: '做空'
        }
      ],
      moneyForm:{},
      is_subminting:false,
      checkedList:[],
      contractList:[],
      contractSelectList:[],
      tongji:{total:'-',totalReward:'-',runing:'-',cancel:'-',sended:'-'},
      coinList:[]
    }
  },
  computed: {

  },
  created() {
    this.getCoinList();
    this.getList();
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
      this.formLine.status = val;
      this.page = 1;
      this.getList();
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&order_no="+this.formLine.order_no+"&name="+this.formLine.name+"&coin_id="+this.formLine.coin_id
        +"&min="+this.formLine.min+"&max="+this.formLine.max
        +"&status="+this.formLine.status;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
      getTongji(param).then(res=>{
        this.tongji = res.data
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
    },
    handleDogrid(){
      this.dialogShow = true;
    },
    handleCancel(){
      this.dialogShow = false;
    },
    onSubmit(){
      this.submiting = true;
      doGrid(this.formData).then(res=>{
        this.handleCancel();
        this.submiting = false;
        this.$message.success(res.message)
      }).catch(()=>{
        this.submiting = false;
      })
    }
  }
}
</script>

<style scoped>

</style>

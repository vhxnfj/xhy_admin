<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.order_no" placeholder="流水号" style="width: 120px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.name" placeholder="用户名" style="width: 100px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="formLine.coin_id" style="width: 120px;" placeholder="请选择" clearable>
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formLine.status" style="width: 80px;" placeholder="选择" clearable>
            <el-option
              v-for="item in options"
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

    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有类型</el-radio-button>
          <el-radio-button label="1">卖出</el-radio-button>
          <el-radio-button label="2">买入</el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding: 20px;background: #f1f1f1;">
        挂出总量：<b>{{tongji.total}}</b>，已完成：<b>{{tongji.successed}}</b>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="order_no"
          label="流水号"
          align="center"
          fixed="left"
          width="180">
        </el-table-column>
        <el-table-column
          prop="user"
          label="发布人"
          fixed="left"
          width="120">
        </el-table-column>
        <el-table-column
          prop="num"
          label="挂单数量"
          width="100">
          <template slot-scope="{row}">
            {{row.num}} {{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="success_num"
          label="已完成"
          width="100">
          <template slot-scope="{row}">
            {{row.success_num}} {{row.coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="交易类型"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <span :style="{color:row.type == 1 ? 'green' : 'red'}">{{row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          width="120">
          <template slot-scope="{row}">
            {{row.price}} {{row.buy_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="总价"
          width="140">
          <template slot-scope="{row}">
            {{row.amount}} {{row.buy_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="手续费"
          width="120">
          <template slot-scope="{row}">
            {{row.fee}} {{row.buy_coin}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          label="费率"
          align="center"
          width="80">
          <template slot-scope="{row}">{{row.rate}} %</template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
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
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleShow(row)">查看订单</el-button>
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

    <el-dialog
      title="交易订单"
      :visible.sync="dialogShow"
      width="800px">
      <div>
        <div v-if="orderInfo">
          <el-table
            :data="orderInfo"
            border
            style="width: 100%">
            <el-table-column
              prop="order_no"
              label="流水号"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="user"
              label="购买用户"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="num"
              label="购买数量"
              align="center">
              <template slot-scope="{row}">
                {{row.num}} {{row.coin}}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="消费数量"
              align="center">
              <template slot-scope="{row}">
                {{row.amount}} {{row.buy_coin}}
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="成交时间"
              align="center"
              width="180">
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: center;padding: 100px 0px;" v-else>
          <i class="el-icon-loading"></i>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {coinSelectList} from '@/api/coin'
import { getTradeList, getTradeOrder, getTradeTongji } from '@/api/trade'

export default {
  name: 'coin_trade',
  data(){
    return {
      dialogShow:false,
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
      formData:{
        username:'',
        coin_id:'',
        amount:''
      },
      updateForm:{

      },
      formLine:{
        order_no:'',
        name:'',
        coin_id:'',
        status:'',
        date:null
      },
      selectList:[],
      options: [{
        value: '1',
        label: '挂出'
      }, {
        value: '2',
        label: '完成'
      }, {
        value: '3',
        label: '撤销'
      }],
      orderInfo:null,
      tongji:{successed:'-',total:'-'}
    }
  },
  computed: {

  },
  created() {
    this.getList();
    this.getSelectList();
  },
  activated() {
    this.getSelectList();
  },
  methods:{
    getSelectList(){
      coinSelectList().then(res=>{
        this.selectList = res.data
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
        +"&order_no="+this.formLine.order_no+"&name="+this.formLine.name+"&type="+this.activeType
        +"&coin_id="+this.formLine.coin_id+"&status="+this.formLine.status;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getTradeList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
      getTradeTongji(param).then(res=>{
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
    handleShow(row){
      this.nowRow = row
      this.dialogShow = true
      this.orderInfo = null
      getTradeOrder(row.id).then(res=>{
        this.orderInfo = res.data
      })
    }
  }
}
</script>

<style scoped>

</span>

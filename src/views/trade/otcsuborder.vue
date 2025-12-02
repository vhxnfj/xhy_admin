<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="formLine.order_no" style="width: 170px;" placeholder="订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input v-model="formLine.name" style="width: 120px;" placeholder="收款人名" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.username" style="width: 120px;" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="formLine.date"
            style="width: 260px;"
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
          <el-radio-button label="1">待审核</el-radio-button>
          <el-radio-button label="2">已完成</el-radio-button>
          <el-radio-button label="3">已拒绝</el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding: 20px;background: #f1f1f1;">
        总成交：<b>{{tongji.total}}元</b>，今日成交：<b>{{tongji.today}}元</b>，白名单总收：<b>{{tongji.total_white_in}}元</b>，白名单总出：<b>{{tongji.total_white_out}}元</b>，白名单今日收：<b>{{tongji.today_white_in}}元</b>，白名单今日出：<b>{{tongji.today_white_out}}元</b>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="交易单号">
                <span>{{ row.trade_order_no}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="order_no" width="220" label="订单号">
        </el-table-column>
        <el-table-column prop="username" min-width="180" label="商户">
          <template slot-scope="{row}">
            <div>{{row.username}}</div>
            <div>昵称：{{row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyer" min-width="180" label="买家">
        </el-table-column>
        <el-table-column prop="coinName" label="买入币种">
        </el-table-column>
        <el-table-column prop="contact_type" width="200" label="联系方式">
          <teamplate slot-scope="{row}">
            <div><b>联系方式：</b>{{row.contact_type}}</div>
            <div><b>联系信息：</b>{{row.contact_name}}</div>
          </teamplate>
        </el-table-column>
        <el-table-column prop="bank_type" width="350" label="收款信息">
          <teamplate slot-scope="{row}">
            <teamplate v-if="row.is_show_pay == 1">
              <div><b>收款类型：</b>{{row.paymentName}}</div>
              <teamplate v-if="row.payment ==0">
                <div><b>支行名称：</b>{{row.bank_name}}<i @click="copyToClipboard(row.bank_name)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
                <div><b>银行卡号：</b>{{row.card_number}}<i @click="copyToClipboard(row.card_number)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
                <div><b>开户姓名：</b>{{row.real_name}}<i @click="copyToClipboard(row.real_name)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
              </teamplate>
              <teamplate v-else>
                <div><b>收款账号：</b>{{row.pay_account}}<i @click="copyToClipboard(row.pay_account)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
                <div v-if="row.pay_qr"><b>收款码：</b><el-image :src="row.pay_qr" :preview-src-list="[row.pay_qr]" style="width: 80px;height: 80px;"></el-image></div>
              </teamplate>
            </teamplate>
            <teamplate v-else>
              不显示收款信息
            </teamplate>
          </teamplate>
        </el-table-column>
        <el-table-column prop="num" label="交易数量" width="100">
        </el-table-column>
        <el-table-column prop="price" label="成交价格">
        </el-table-column>
        <el-table-column prop="amount" label="付款金额">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==0">{{row.statusName}}</el-tag>
            <el-tag type="success" v-else-if="row.status==1">{{row.statusName}}</el-tag>
            <el-tag type="danger" v-else-if="row.status==2">{{row.statusName}}</el-tag>
            <el-tag type="warning" v-else-if="row.status==3">{{row.statusName}}</el-tag>
            <el-tag type="info" v-else>{{row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" width="160" label="创建时间">
        </el-table-column>
        <el-table-column width="180" label="操作" fixed="right">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" :disabled="row.status == 0 ? false : true" @click="doOrder(row.id)">完成</el-button>
            <el-button size="small" type="danger" :disabled="row.status == 0 ? false : true" @click="cancelOrder(row.id)">拒绝</el-button>
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
  </div>
</template>

<script>
import {getList,cancelOrder,doOrder,getTongji} from '@/api/otcsub'
export default {
  name: 'otcsuborder',
  data(){
    return {
      tongji:{
        total:0,
        today:0,
        total_white_in:0,
        today_white_in:0,
        total_white_out:0,
        today_white_out:0
      },
      tableData:[],
      loading:false,
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      paymentList:[],
      activeType:0,
      formLine:{
        order_no:'',
        payment:'',
        username:'',
        parentuser:'',
        admin:'',
        name:'',
        date:null
      },
      timer:null,
    }
  },
  created() {
    this.getTongji();
    this.getList();
    /*this.timer = setTimeout(()=>{
      this.autoRefresh();
    },10000);*/
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  watch:{
    '$store.state.app.newmessage'(val){
      if(val.newout>0 && this.page == 1){
        this.getList();
      }
    }
  },
  methods:{
    autoRefresh(){
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.autoRefresh();
      },30000);
      if(this.page == 1){
        this.getList();
      }
    },
    search(){
      this.page = 1;
      this.getTongji();
      this.getList();
    },
    handleClickTab(val){
      this.activeType = val;
      this.page = 1;
      this.getList();
    },
    getTongji(){
      getTongji().then(res=>{
        this.tongji = res.data
      })
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&username="+this.formLine.username+"&keyword="+this.formLine.order_no
        +'&status='+this.activeType+"&parentuser="+this.formLine.parentuser+"&name="+this.formLine.name;
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
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    cancelOrder(id){
      this.$confirm('是否取消此OTC交易？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({value}) => {
        cancelOrder({id:id}).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    doOrder(id){
      this.$confirm('是否完成此OTC交易？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        doOrder(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    copyToClipboard(txt) {
      this.$copyText(txt).then((e)=>{
        this.$message.success("复制成功");
      },(e)=>{
        this.$message.error("复制失败");
      });
    }
  }
}
</script>

<style scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

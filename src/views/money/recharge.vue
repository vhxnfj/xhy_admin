<script src="../../../../4hao_u_admin/src/api/finance.js"></script>
<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="formLine.order_no" style="width: 170px;" placeholder="订单号/平台订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="formLine.payment" placeholder="请选择" style="width: 120px;">
            <el-option label="全部" value="0"></el-option>
            <el-option :label="item.short_name" :value="item.id" v-for="(item,index) in paymentList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.username" style="width: 120px;" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="团队长">
          <el-input v-model="formLine.parentuser" style="width: 120px;" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model="formLine.admin" style="width: 120px;" placeholder="登陆名" clearable></el-input>
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
          <el-radio-button label="1">待支付</el-radio-button>
          <el-radio-button label="2">已完成</el-radio-button>
          <el-radio-button label="3">已取消</el-radio-button>
          <el-radio-button label="4">虚拟到账</el-radio-button>
        </el-radio-group>
      </div>
      <div style="margin-bottom: 20px;">
        <el-tag type="success">今日充值：{{tongji.today}}元</el-tag>
        <el-tag>今日去白名单充值：{{tongji.today_user}}元</el-tag>
        <el-tag type="warning">总充值：{{tongji.total}}元</el-tag>
        <el-tag type="danger">去白名单总充值：{{tongji.total_user}}元</el-tag>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="平台名称">
                <span>{{ row.payment_name }}</span>
              </el-form-item>
              <el-form-item label="平台订单号">
                <span>{{ row.out_order_no }}</span>
              </el-form-item>
              <el-form-item label="支付地址">
                <span>{{ row.pay_url }}</span>
              </el-form-item>
              <el-form-item label="到账时间">
                <span>{{ row.payed_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="order_no" width="180" label="订单号">
        </el-table-column>
        <el-table-column min-width="120" prop="username" label="充值用户">
        </el-table-column>
        <el-table-column prop="real_name" label="真实姓名">
        </el-table-column>
        <el-table-column prop="payment" label="充值平台">
        </el-table-column>
        <el-table-column prop="amount" label="充值金额">
        </el-table-column>
        <el-table-column prop="fee" label="手续费">
        </el-table-column>
        <el-table-column prop="recharge" label="实际到账">
        </el-table-column>
        <el-table-column min-width="100" prop="num" label="到账USDT">
        </el-table-column>
        <el-table-column prop="admin" label="操作管理员" width="120">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==0">{{row.statusName}}</el-tag>
            <el-tag type="success" v-else-if="row.status==1">{{row.statusName}}</el-tag>
            <el-tag type="danger" v-else-if="row.status==2">{{row.statusName}}</el-tag>
            <el-tag type="info" v-else>{{row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" width="160" label="创建时间">
        </el-table-column>
        <el-table-column width="260" label="操作" fixed="right">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" :disabled="row.status==0 ? false : true" @click="doOrder(row.id)">到账</el-button>
            <el-button size="small" type="danger" :disabled="row.status==0 ? false : true" @click="cancelOrder(row.id)">取消</el-button>
            <el-button size="small" type="waring" :disabled="row.status==0 ? false : true" @click="doOrder(row.id,true)">虚拟到账</el-button>
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
  import {getList,getTongji,cancelOrder,doOrder,doSuccessOrder} from '@/api/recharge'
  import {getPayment} from '@/api/payment'
  export default {
    name: 'recharge',
    data(){
      return {
        tongji:{
          today:0,
          today_user:0,
          total:0,
          total_user:0
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
          date:null
        },
        timer:null,
      }
    },
    created() {
      this.getList();
      this.getPaymentList();
      /*this.timer = setTimeout(()=>{
        this.autoRefresh();
      },10000);*/
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
    watch:{
      '$store.state.app.newmessage'(val){
        if(val.newrecharge>0 && this.page == 1){
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
        this.getList();
      },
      handleClickTab(val){
        this.activeType = val;
        this.page = 1;
        this.getList();
      },
      getPaymentList(){
        getPayment().then(res=>{
          this.paymentList = res.data;
        });
      },
      getList(){
        var param = 'page='+this.page+"&pagesize="+this.pagesize
          +"&username="+this.formLine.username+"&keyword="+this.formLine.order_no+"&payment="+this.formLine.payment
          +"&admin="+this.formLine.admin+'&status='+this.activeType+"&parentuser="+this.formLine.parentuser;
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        this.loading = true;
        getTongji(param).then(res=>{
          this.tongji = res.data
        })
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
        this.$confirm('是否取消此充值订单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelOrder(id).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      doOrder(id,success){
        if (success){
          this.$confirm('虚拟到账不进报表，是否完成此充值订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            doSuccessOrder(id).then(res=>{
              this.getList();
              this.$message.success(res.message);
            });
          })
        }else{
          this.$confirm('执行后金额会立即到账，是否完成此充值订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            doOrder(id).then(res=>{
              this.getList();
              this.$message.success(res.message);
            });
          })
        }

      },
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

<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="formLine.order_no" style="width: 170px;" placeholder="提现订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input v-model="formLine.name" style="width: 120px;" placeholder="收款人名" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="formLine.username" style="width: 120px;" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="团队长">
          <el-input v-model="formLine.parentuser" style="width: 120px;" placeholder="用户名" clearable></el-input>
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
          <el-radio-button label="4">代付中</el-radio-button>
        </el-radio-group>
      </div>
      <div style="margin-bottom: 20px;">
        <el-tag type="danger">待审核：{{tongji.waiting}}元</el-tag>
        <el-tag type="success">今日提现：{{tongji.today}}元</el-tag>
        <el-tag>今日去白名单提现：{{tongji.today_user}}元</el-tag>
        <el-tag type="warning">总提现：{{tongji.total}}元</el-tag>
        <el-tag type="info">去白名单总提现：{{tongji.total_user}}元</el-tag>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="提现单号">
                <span>{{ row.order_no}}</span>
              </el-form-item>
              <el-form-item label="拒绝原因">
                <span>{{ row.refuse_info ? row.refuse_info : '-' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="username" min-width="180" label="用户">
          <teamplate slot-scope="{row}">
            <div><b>{{row.username}}</b></div>
            <div>昵称：{{row.name}}</div>
            <div>团队：{{row.team}}</div>
            <div>层级：{{row.user_level}}</div>
          </teamplate>
        </el-table-column>
        <el-table-column prop="bank_type" width="350" label="收款信息">
          <teamplate slot-scope="{row}">
            <div v-if="row.type == 'trc20'">
              <div><b>钱包类型：</b>TRC20</div>
              <div><b>钱包地址：</b>{{row.trc_addr}}<i @click="copyToClipboard(row.trc_addr)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
              <div><b>提币数量：</b>{{row.get_num}} USDT<i @click="copyToClipboard(row.get_num)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
            </div>
            <div v-else>
              <div><b>银行名称：</b>{{row.bank_type}}<i @click="copyToClipboard(row.bank_type)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
              <div><b>支行名称：</b>{{row.bank_name}}<i @click="copyToClipboard(row.bank_name)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
              <div><b>银行卡号：</b>{{row.card_number}}<i @click="copyToClipboard(row.card_number)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
              <div><b>开户姓名：</b>{{row.real_name}}<i @click="copyToClipboard(row.real_name)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
              <div><b>提现金额：</b>{{row.amount}}<i @click="copyToClipboard(row.amount)" style="margin-left: 10px;" class="el-icon-document-copy"></i></div>
            </div>
          </teamplate>
        </el-table-column>
        <el-table-column prop="num" label="提出USDT" width="100">
        </el-table-column>
        <el-table-column prop="amount" label="提现金额">
        </el-table-column>
        <el-table-column prop="fee" label="手续费">
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
        <el-table-column width="220" label="操作" fixed="right">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" :disabled="row.status == 0 || row.status == 3 ? false : true" @click="doOrder(row.id)">到账</el-button>
            <el-button size="small" type="warning" :disabled="row.status==0 ? false : true" @click="doDaifu(row.id)">代付</el-button>
            <el-button size="small" type="danger" :disabled="row.status == 0 || row.status == 3 ? false : true" @click="cancelOrder(row.id)">拒绝</el-button>
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
  import {getCashoutList,getTongji,cancelOrder,doOrder,doDaifu} from '@/api/out'
  export default {
    name: 'out',
    data(){
      return {
        tongji:{
          waiting:0,
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
          name:'',
          date:null
        },
        timer:null,
      }
    },
    created() {
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
        this.getList();
      },
      handleClickTab(val){
        this.activeType = val;
        this.page = 1;
        this.getList();
      },
      getList(){
        var param = 'page='+this.page+"&pagesize="+this.pagesize
          +"&username="+this.formLine.username+"&keyword="+this.formLine.order_no
          +'&status='+this.activeType+"&parentuser="+this.formLine.parentuser+"&name="+this.formLine.name;
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        this.loading = true;
        getTongji(param).then(res=>{
          this.tongji = res.data
        })
        getCashoutList(param).then(res=>{
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
        this.$prompt('请输入拒绝原因说明', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(({value}) => {
          cancelOrder({id:id,info:value}).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      doOrder(id){
        this.$confirm('是否完成此提现申请？', '提示', {
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
      doDaifu(id){
        this.$confirm('是否将此提现提交代付？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           doDaifu(id).then(res=>{
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

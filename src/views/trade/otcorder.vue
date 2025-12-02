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
        <el-form-item label="商户类型">
          <el-select v-model="formLine.merchant" style="width: 120px;" placeholder="请选择" clearable>
            <el-option
              label="认证商户"
              :value="1">
            </el-option>
            <el-option
              label="普通用户"
              :value="0">
            </el-option>
          </el-select>
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
          <el-radio-button label="2">进行中</el-radio-button>
          <el-radio-button label="3">已完成</el-radio-button>
          <el-radio-button label="4">已撤销</el-radio-button>
        </el-radio-group>
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
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="username" min-width="180" label="用户">
          <template slot-scope="{row}">
            <div>{{row.username}}</div>
            <div>昵称：{{row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="is_merchant" label="商户">
          <template slot-scope="{row}">
            <el-tag v-if="row.is_merchant">认证商户</el-tag>
            <el-tag type="info" v-else>普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_top" label="置顶">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_top" @change="onTopChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="coinName" align="center" label="交易币种" width="100">
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
        <el-table-column prop="trade_type" label="交易类型">
        </el-table-column>
        <el-table-column prop="num" label="交易数量" width="100">
        </el-table-column>
        <el-table-column prop="frozen" label="冻结数量" width="100">
        </el-table-column>
        <el-table-column prop="success_num" label="完成数量" width="100">
        </el-table-column>
        <el-table-column prop="price" label="浮动价格">
        </el-table-column>
        <el-table-column prop="fee" label="手续费">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="{row}">
            <el-tag type="info" v-if="row.status==0">{{row.statusName}}</el-tag>
            <el-tag v-else-if="row.status==1">{{row.statusName}}</el-tag>
            <el-tag type="success" v-else-if="row.status==2">{{row.statusName}}</el-tag>
            <el-tag type="danger" v-else-if="row.status==3">{{row.statusName}}</el-tag>
            <el-tag type="info" v-else>{{row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" width="160" label="创建时间">
        </el-table-column>
        <el-table-column width="180" label="操作" fixed="right">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" :disabled="row.status == 0 ? false : true" @click="doOrder(row.id)">审核</el-button>
            <el-button size="small" type="danger" :disabled="row.status == 0 || row.status == 1 ? false : true" @click="cancelOrder(row.id)">撤销</el-button>
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
import {getList,cancelOrder,doOrder,setOrderTop,cancelOrderTop} from '@/api/otc'
export default {
  name: 'otcorder',
  data(){
    return {
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
        merchant:'',
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
        +"&username="+this.formLine.username+"&keyword="+this.formLine.order_no+"&merchant="+this.formLine.merchant
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
      this.$confirm('是否审核此OTC交易？', '提示', {
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
    },
    onTopChange(row){
      if(row.is_top){
        setOrderTop(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(()=>{
          row.is_top = false;
        })
      }else{
        cancelOrderTop(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(()=>{
          row.is_top = true;
        })
      }
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

<template>
    <div class="app-container">
      <div class="search-box">
        <el-form :inline="true" class="demo-form-inline">
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
        <div class="total-box">
          <div class="total-item">
            <div class="card-panel-num">{{totalData.register}}</div>
            <div class="title">总注册</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.profit}}</div>
            <div class="title">总收益</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.amount}}</div>
            <div class="title">总消费</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.bonus}}</div>
            <div class="title">总奖金</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.recharge}}</div>
            <div class="title">总充值U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.out}}</div>
            <div class="title">总提现U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.add_money}}</div>
            <div class="title">总充人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.reduce_money}}</div>
            <div class="title">总提人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.fandian}}</div>
            <div class="title">总返点</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.fee}}</div>
            <div class="title">总手续费</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.pay_money}}</div>
            <div class="title">总赔付</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.miner}}</div>
            <div class="title">总产出</div>
          </div>
        </div>

        <el-divider></el-divider>

        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%">
          <el-table-column prop="created_at" label="日期" width="100">
          </el-table-column>
          <el-table-column prop="register" label="注册人数">
          </el-table-column>
          <el-table-column prop="profit" label="产生收益">
          </el-table-column>
          <el-table-column prop="amount" label="消费">
          </el-table-column>
          <el-table-column prop="bonus" label="奖金">
          </el-table-column>
          <el-table-column prop="recharge" label="充U">
          </el-table-column>
          <el-table-column prop="out" label="提U">
          </el-table-column>
          <el-table-column prop="add_money" label="充人民币">
          </el-table-column>
          <el-table-column prop="reduce_money" label="提人民币">
          </el-table-column>
          <el-table-column prop="fandian" label="返点">
          </el-table-column>
          <el-table-column prop="fee" label="手续费">
          </el-table-column>
          <el-table-column prop="miner" label="矿机产出">
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
  import CountTo from 'vue-count-to'
  import {getTotal,getReportList} from '@/api/report'
  export default {
    name: 'profit',
    components:{CountTo},
    data(){
      return {
        tableData:[],
        loading:false,
        page:1,
        pagesize:20,
        meta:{
          total:0
        },
        totalData:{
          register:0,
          amount:0,
          bonus:0,
          recharge:0,
          out:0,
          fandian:0,
          event:0,
          fee:0,
          miner:0,
          dividends:0,
          profit:0,
          add_money:0,
          reduce_money:0,
          pay_money:0
        },
        formLine:{
          date:null
        }
      }
    },
    created() {
      this.search();
    },
    methods:{
      search(){
        this.page = 1;
        this.loadTotal();
        this.getList();
      },
      loadTotal(){
        var param = '';
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        getTotal(param).then(res=>{
          this.totalData = res.data;
        });
      },
      getList(){
        var param = 'page='+this.page+"&pagesize="+this.pagesize;
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        this.loading = true;
        getReportList(param).then(res=>{
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
    }
  }
</script>

<style scoped>
.total-box{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.total-box .total-item{
  text-align: center;
}
.total-box .total-item .title{
  font-size: 14px;
  color:#5a5e66;
  font-weight: bold;
  margin-top: 12px;
}
.card-panel-num{
  font-weight: bold;
  font-size:18px;
  color: #2b2f3a;
}
</style>

<template>
    <div class="app-container">
      <div class="search-box">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户名" prop="keyword">
            <el-input v-model="formLine.keyword" placeholder="请输入用户名"></el-input>
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
        <div slot="header" class="clearfix" v-if="$route.query.username">
          <span style="font-weight: bold;">{{$route.query.username}}的团队报表</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="backUpLevel">返回上级</el-button>
        </div>
        <div style="height: 20px;" v-if="$route.query.username"></div>
        <div class="total-box">
          <div class="total-item">
            <div class="card-panel-num">{{totalData.today_user_count}}</div>
            <div class="title">今日注册</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.user_count}}</div>
            <div class="title">总注册</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.today_recharge}}U</div>
            <div class="title">今日充U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.today_out}}U</div>
            <div class="title">今日提U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.waiting}}U</div>
            <div class="title">待提U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num" style="color: #1d8e11">{{totalData.recharge}}U</div>
            <div class="title">总充U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num" style="color: #f4516c">{{totalData.out}}U</div>
            <div class="title">总提U</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.today_recharge_money}}</div>
            <div class="title">今日充人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.today_out_money}}元</div>
            <div class="title">今日提人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.waiting_money}}元</div>
            <div class="title">待提人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num" style="color: #1d8e11">{{totalData.recharge_money}}</div>
            <div class="title">总充人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num" style="color: #f4516c">{{totalData.out_money}}元</div>
            <div class="title">总提人民币</div>
          </div>
          <div class="total-item">
            <div class="card-panel-num">{{totalData.coin_total}}</div>
            <div class="title">总剩余USDT</div>
          </div>
        </div>

        <el-divider></el-divider>

        <el-table
          :data="tableData"
          v-loading="loading"
          @sort-change="onSort"
          row-key="id"
          lazy
          :load="load"
          style="width: 100%">
          <el-table-column prop="username" label="会员" fixed="left" min-width="150">
            <template scope="{row}">
              <el-link type="primary" @click="goPage('?pid='+row.id+'&username='+row.username)">{{row.username}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="team_flag" label="团队" fixed="left">
          </el-table-column>
          <el-table-column prop="coin_ach" label="U业绩" width="120" fixed="left">
          </el-table-column>
          <el-table-column prop="money_ach" label="人民币业绩" width="120" fixed="left">
          </el-table-column>
          <el-table-column prop="coin_num" width="140" label="余额(USDT)" sortable>
          </el-table-column>
          <el-table-column prop="coin_total" width="160" label="团队余额(USDT)" sortable>
          </el-table-column>
          <el-table-column prop="sub_count" label="直推人数" width="100" sortable>
          </el-table-column>
          <el-table-column prop="team_count" label="团队人数" width="100" sortable>
          </el-table-column>
          <el-table-column prop="today_recharge" label="今日充U" width="100" sortable>
          </el-table-column>
          <el-table-column prop="today_out" label="今日提U" width="120" sortable>
          </el-table-column>
          <el-table-column prop="recharge" label="总充U" width="120" sortable>
          </el-table-column>
          <el-table-column prop="out" label="总提U" width="120" sortable>
          </el-table-column>
          <el-table-column prop="waiting" label="待提U" width="120" sortable>
          </el-table-column>
          <el-table-column prop="today_recharge_money" label="今日充值" width="120" sortable>
          </el-table-column>
          <el-table-column prop="today_out_money" label="今日提现" width="120" sortable>
          </el-table-column>
          <el-table-column prop="recharge_money" label="总充值" width="120" sortable>
          </el-table-column>
          <el-table-column prop="out_money" label="总提现" width="120" sortable>
          </el-table-column>
          <el-table-column prop="waiting" label="待提现" width="120" sortable>
          </el-table-column>
          <el-table-column prop="otc_in" label="OTC总买" width="120" sortable>
          </el-table-column>
          <el-table-column prop="otc_out" label="OTC总卖" width="120" sortable>
          </el-table-column>
          <el-table-column prop="today_otc_in" label="今日OTC买" width="120" sortable>
          </el-table-column>
          <el-table-column prop="today_otc_out" label="今日OTC卖" width="120" sortable>
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
  import {getTemaReportTotal,getTemaReport,getTeamSubReport} from '@/api/report'
  export default {
    name: 'team',
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
          today_user_count:0,
          user_count:0,
          today_recharge:0,
          recharge:0,
          coin_recharge:0,
          today_out:0,
          coin_out:0,
          out:0,
          waiting:0,
          coin_total:0,
          today_recharge_money:0,
          recharge_money:0,
          today_out_money:0,
          out_money:0,
          waiting_money:0,
        },
        formLine:{
          date:null,
          keyword:''
        },
        orderBy:{
          name:'',
          order:''
        }

      }
    },
    created() {
      this.search();
    },
    watch:{
      $route:{
        handler(path){
          this.formLine.keyword = "";
          this.search();
        },
        deep:true
      }
    },
    methods:{
      search(){
        this.page = 1;
        this.loadTotal();
        this.getList();
      },
      loadTotal(){
        var param = 'keyword='+this.formLine.keyword;
        if(this.$route.query.pid){
          param += "&parent_id="+this.$route.query.pid;
        }
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        getTemaReportTotal(param).then(res=>{
          this.totalData = res.data;
        });
      },
      getList(){
        var param = 'keyword='+this.formLine.keyword+'&page='+this.page+"&pagesize="+this.pagesize;

        if(this.$route.query.pid){
          param += "&parent_id="+this.$route.query.pid;
        }
        if(this.formLine.date){
          param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
        }
        this.loading = true;
        getTemaReport(param).then(res=>{
          this.loading = false;
          this.tableData = res.data;
          this.meta = res.meta;
        }).catch(error=>{
          this.loading = false;
        });
      },
      load(tree, treeNode, resolve){
        getTeamSubReport(tree.id).then(res =>{
          resolve(res.data)
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
      goPage(url){
        //location.href = url;
        this.$router.push({path:url});
      },
      backUpLevel(){
        window.history.back();
      },
      onSort(a){

      }
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

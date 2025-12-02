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
        <el-radio-group v-model="formLine.status" @change="handleClickTab">
          <el-radio-button label="0">全部</el-radio-button>
          <el-radio-button :label="item.value" v-for="(item,index) in options" :key="index">{{item.label}}</el-radio-button>
        </el-radio-group>
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
          prop="title"
          label="矿机"
          fixed="left"
          min-width="150">
          <template slot-scope="{row}">
            {{row.title}} - {{row.model}}
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="price"
          label="购买价格"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="total_profit"
          label="预计收益"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="get_profit"
          label="已产生收益"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="profit_pool"
          label="待发放"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="total_time"
          label="总时长(分钟)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="run_time"
          label="已运行(分钏)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="run_rate"
          label="完成率"
          align="center"
          width="100">
          <template slot-scope="{row}">
            {{row.run_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="days"
          label="总运行(天)"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="status"
          label="矿机状态"
          align="center"
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
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updated_at"
          width="160"
          label="最后修改">
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
import { getOrderList, getTongji } from '@/api/miner'

export default {
  name: 'order',
  data(){
    return {
      dialogShow:false,
      dialogShow2:false,
      dialogShow3:false,
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
        days:'',
        status:0,
        date:null
      },
      selectList:[],
      options: [{
        value: '1',
        label: '运行中'
      }, {
        value: '2',
        label: '已到期'
      }],
      moneyForm:{},
      is_subminting:false,
      checkedList:[],
      contractList:[],
      contractSelectList:[],
      tongji:{total:'-',totalReward:'-',runing:'-',cancel:'-',sended:'-'}
    }
  },
  computed: {

  },
  created() {
    this.getList();
  },
  methods:{
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
        +"&order_no="+this.formLine.order_no+"&name="+this.formLine.name+"&days="+this.formLine.days
        +"&order_no="+this.formLine.order_no+"&status="+this.formLine.status;
      if(this.formLine.date){
        param += "&start="+this.formLine.date[0]+"&end="+this.formLine.date[1]
      }
      this.loading = true;
      getOrderList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
      /*getTongji(param).then(res=>{
        this.tongji = res.data
      })*/
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    }
  }
}
</script>

<style scoped>

</style>

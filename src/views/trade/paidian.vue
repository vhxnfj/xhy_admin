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
        <el-form-item label="状态">
          <el-select v-model="formLine.status" placeholder="请选择" clearable>
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

    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>收益加币</el-button>
    </div>

    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有产品</el-radio-button>
          <el-radio-button :label="item.id" v-for="(item,index) in selectList" :key="index">{{item.title}}</el-radio-button>
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
          prop="title"
          label="标题"
          fixed="left"
          min-width="120">
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
          label="投资币种"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="num"
          label="投资数量"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="reward_amount"
          label="已产生收益"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="reward_amount_get"
          label="已到账收益"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sub_count"
          label="下级数"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="level"
          label="所在层"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="排点位置"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <i class="el-icon-bottom-left" v-if="row.position == 0"></i>
            {{row.positionName}}
            <i class="el-icon-bottom-right" v-if="row.position == 1"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="排点状态"
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
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="{row}">
            <el-button type="success" size="small" @click="handleAdd(row)">加币</el-button>
            <el-button type="primary" size="small" @click="handleShow(row)">查看树形</el-button>
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
      title="树型图"
      :visible.sync="dialogShow"
      width="800px">
      <div style="overflow: scroll;max-height: 600px;">
        <el-tree
          :data="treeData"
          :props="props"
          :load="loadNode"
          lazy>
        </el-tree>
      </div>
    </el-dialog>

    <el-dialog
      title="收益加币"
      :visible.sync="dialogShow2"
      width="500px">
      <el-form :model="moneyForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户" prop="username">
          <el-input v-model="moneyForm.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="流水号" prop="order_no">
          <el-input v-model="moneyForm.order_no" readonly></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="moneyForm.num"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow2=false">取 消</el-button>
        <el-button type="primary" :disabled="is_subminting" :loading="is_subminting" @click="onSubmitMoney">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="收益加币"
      :visible.sync="dialogShow3"
      width="500px">
      <el-form :model="updateForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="数量" prop="amount">
          <el-input v-model="updateForm.num"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow3=false">取 消</el-button>
        <el-button type="primary" :disabled="is_subminting" :loading="is_subminting" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getSelectList} from '@/api/coinproduct'
import {getList,getChildren,addPaidianCoin,addPaidianListCoin} from '@/api/paidian'

export default {
  name: 'paidian',
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
        status:'',
        date:null
      },
      selectList:[],
      options: [{
        value: '1',
        label: '排点中'
      }, {
        value: '2',
        label: '已出局'
      }],
      moneyForm:{},
      is_subminting:false,
      checkedList:[]
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
      getSelectList().then(res=>{
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
        +"&order_no="+this.formLine.order_no+"&name="+this.formLine.name+"&product_id="+this.activeType
        +"&order_no="+this.formLine.order_no+"&status="+this.formLine.status;
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
    handleShow(row){
      this.nowRow = row
      this.dialogShow = true
      this.treeData = [{ title: '层级:'+this.nowRow.level+',用户:'+this.nowRow.username+',收益:'+this.nowRow.reward_amount+this.nowRow.coin,id:this.nowRow.id }]
    },
    loadNode(node, resolve){
      if (node.level === 0 && this.nowRow) {
        return resolve([{ title: '层级:'+this.nowRow.level+',用户:'+this.nowRow.username+',收益:'+this.nowRow.reward_amount+this.nowRow.coin,id:this.nowRow.id }]);
      }
      getChildren(node.data.id).then(res=>{
        var data = [];
        res.data.forEach(row=>{
          data.push({ title: '层级:'+row.level+',用户:'+row.username+',收益:'+row.reward_amount+row.coin,id:row.id })
        })
        resolve(data);
      })
    },
    onSubmitMoney(){
      this.is_subminting = true
      addPaidianCoin(this.moneyForm).then(res=>{
        this.dialogShow2 = false
        this.is_subminting = false
        this.getList()
        this.$message.success(res.message);
      }).catch(error=>{
        this.is_subminting = false
      })
    },
    handleSelectionChange(val){
      this.checkedList = [];
      for(var i=0;i<val.length;i++){
        this.checkedList.push(val[i].id);
      }
    },
    handleAdd(){
      this.dialogShow3 = true;
      this.updateForm = {num:''}
    },
    onSubmit(){
      this.is_subminting = true
      var data = this.updateForm
      data['list'] = this.checkedList

      addPaidianListCoin(data).then(res=>{
        this.dialogShow3 = false
        this.is_subminting = false
        this.getList()
        this.$message.success(res.message);
      }).catch(error=>{
        this.is_subminting = false
      })
    }
  }
}
</script>

<style scoped>

</style>

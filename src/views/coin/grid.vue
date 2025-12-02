<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="币种">
          <el-select v-model="formLine.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加策略</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
    </div>
    <el-dialog
      title="添加策略"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px">
        <el-form-item label="币种" prop="coin_type">
          <el-select v-model="formData.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格范围" prop="low_price">
          <el-input v-model="formData.low_price" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.up_price" style="width: 100px;"></el-input>
          USDT
        </el-form-item>
        <el-form-item label="区间数量" prop="num">
          <el-input v-model="formData.num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="投入数量" prop="amount">
          <el-input v-model="formData.amount" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="盈利范围" prop="profit_rate_start">
          <el-input v-model="formData.profit_rate_start" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.profit_rate_end" style="width: 100px;"></el-input>
          %
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改合约信息"
      :visible.sync="dialogShow2"
      width="600px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px">
        <el-form-item label="签约币种" prop="coin_type">
          <el-select v-model="updateForm.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格范围" prop="low_price">
          <el-input v-model="updateForm.low_price" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.up_price" style="width: 100px;"></el-input>
          USDT
        </el-form-item>
        <el-form-item label="区间数量" prop="num">
          <el-input v-model="updateForm.num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="投入数量" prop="amount">
          <el-input v-model="updateForm.amount" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="盈利范围" prop="profit_rate_start">
          <el-input v-model="updateForm.profit_rate_start" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.profit_rate_end" style="width: 100px;"></el-input>
          %
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="coin"
          label="币种"
          align="center">
        </el-table-column>
        <el-table-column
          prop="low_price"
          label="价格范围"
          align="center">
          <template slot-scope="{row}">
            {{row.low_price}} - {{row.up_price}}USDT
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="区间数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="投入数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="profit_rate_start"
          label="盈利范围"
          align="center">
          <template slot-scope="{row}">
            {{row.profit_rate_start}} - {{row.profit_rate_end}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="160"
          label="时间">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">创建时间：</div><div>{{row.created_at}}</div>
            <div style="font-size: 12px;color: #42b983;">最后修改：</div><div>{{row.updated_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="150">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
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
  </div>
</template>

<script>
import {coinSelectList} from '@/api/coin'
import {getList,addGrid,updateGrid,deleteGrid,deleteListGrid} from '@/api/grid'

export default {
  name: 'grid',
  data(){
    return {
      dialogShow:false,
      dialogShow2:false,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      loading:false,
      formData:{},
      updateForm:{},
      formLine:{
        coin_id:'',
      },
      coinList:[],
      selectList:[]
    }
  },
  computed: {

  },
  created() {
    this.getList();
    this.getCoinList();
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
      this.activeType = val;
      this.page = 1;
      this.getList();
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&coin_id="+this.formLine.coin_id;
      this.loading = true;
      getList(param).then(res=>{
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error=>{
        this.loading = false;
      });
    },
    handleCancel(){
      this.dialogShow = false;
      this.resetForm();
    },
    handleCancel2(){
      this.dialogShow2 = false;
      this.updateForm = {};
    },
    handleAdd(){
      this.resetForm();
      this.dialogShow = true;
    },
    handleEdit(row){
      this.updateForm = {
        id:row.id,
        coin_id:row.coin_id,
        low_price:row.low_price,
        up_price:row.up_price,
        num:row.num,
        amount:row.amount,
        profit_rate_start:row.profit_rate_start,
        profit_rate_end:row.profit_rate_end
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        coin_id:'',
        low_price:'',
        up_price:'',
        num:'',
        amount:'',
        profit_rate_start:'',
        profit_rate_end:''
      }
    },
    onSubmitAdd(){
      addGrid(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateGrid(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此策略删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGrid(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    handleSelectionChange(val){
      this.selectList = [];
      for(var i=0;i<val.length;i++){
        this.selectList.push(val[i].id);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    onDeleteList(){
      this.$confirm('是否删除所选择的策略？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListGrid(this.selectList).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    }
  }
}
</script>

<style scoped>

</style>

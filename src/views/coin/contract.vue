<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="币种名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="期限">
          <el-input v-model="formLine.cycle" placeholder="输入期限" style="width:150px;" clearable></el-input>
          <el-select v-model="formLine.cycle_type" clearable placeholder="请选择" style="width: 100px;">
            <el-option
              v-for="item in options"
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
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加合约</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
    </div>
    <el-dialog
      title="添加产品"
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
        <el-form-item label="委托类型" prop="buy_type">
          <el-radio v-model="formData.buy_type" :label="0">普通委托</el-radio>
          <el-radio v-model="formData.buy_type" :label="1">计划委托</el-radio>
        </el-form-item>
        <el-form-item label="盈利时间范围" v-if="formData.buy_type == 1">
          <el-date-picker
            v-model="formData.win_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买周期" prop="cycle">
          <el-input v-model="formData.cycle" style="width: 100px;"></el-input>
          <el-select v-model="formData.cycle_type" placeholder="请选择" style="width: 100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盈利范围" prop="return_rate">
          <el-input v-model="formData.return_start_rate" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.return_end_rate" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="亏损范围" prop="return_rate">
          <el-input v-model="formData.loss_start_rate" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.loss_end_rate" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="购买限量" prop="max_count">
          <el-input v-model="formData.min_count" style="width: 100px;"></el-input>
          -
          <el-input v-model="formData.max_count" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="手续费" prop="fee_rate">
          <el-input v-model="formData.fee_rate" style="width: 200px;"></el-input> %
        </el-form-item>
        <el-form-item label="是否赢利" prop="flag">
          <el-switch v-model="formData.flag"></el-switch>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="formData.status"></el-switch>
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
        <el-form-item label="委托类型" prop="buy_type">
          <el-radio v-model="updateForm.buy_type" :label="0">普通委托</el-radio>
          <el-radio v-model="updateForm.buy_type" :label="1">计划委托</el-radio>
        </el-form-item>
        <el-form-item label="盈利时间范围" v-if="updateForm.buy_type == 1">
          <el-date-picker
            v-model="updateForm.win_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买周期" prop="cycle">
          <el-input v-model="updateForm.cycle" style="width: 100px;"></el-input>
          <el-select v-model="updateForm.cycle_type" placeholder="请选择" style="width: 100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盈利范围" prop="return_rate">
          <el-input v-model="updateForm.return_start_rate" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.return_end_rate" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="亏损范围" prop="return_rate">
          <el-input v-model="updateForm.loss_start_rate" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.loss_end_rate" style="width: 100px;"></el-input>
          %
        </el-form-item>
        <el-form-item label="购买限量" prop="max_count">
          <el-input v-model="updateForm.min_count" style="width: 100px;"></el-input>
          -
          <el-input v-model="updateForm.max_count" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="手续费" prop="fee_rate">
          <el-input v-model="updateForm.fee_rate" style="width: 200px;"></el-input> %
        </el-form-item>
        <el-form-item label="是否赢利" prop="flag">
          <el-switch v-model="updateForm.flag"></el-switch>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="updateForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有类型</el-radio-button>
          <el-radio-button label="1">已停用</el-radio-button>
          <el-radio-button label="2">启用中</el-radio-button>
        </el-radio-group>
      </div>

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
          prop="buy_type"
          label="委托类型"
          min-width="160"
          align="center">
          <template slot-scope="{row}">
            {{row.buy_type == 0 ? '普通委托' : '计划委托'}}
            <div>{{row.win_time[0]}}</div>
            <div>{{row.win_time[1]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cycle"
          label="购买周期"
          align="center">
          <template slot-scope="{row}">
            {{row.cycle}}{{row.cycle_name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="return_rate"
          label="盈利范围"
          align="center">
          <template slot-scope="{row}">
            {{row.return_start_rate}} - {{row.return_end_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="loss_rate"
          label="亏损范围"
          align="center">
          <template slot-scope="{row}">
            {{row.loss_start_rate}} - {{row.loss_end_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="max_count"
          label="购买限量"
          align="center">
          <template slot-scope="{row}">
            {{row.min_count}}-{{row.max_count}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fee_rate"
          label="手续费"
          align="center">
          <template slot-scope="{row}">
            {{row.fee_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="flag"
          label="盈利/亏损"
          min-width="160"
          align="center">
          <template slot-scope="{row}">
            <el-switch
              active-text="盈利"
              inactive-text="亏损"
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="row.flag" @change="flagChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="启用状态"
          align="center">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status" @change="stopChange(row)">
            </el-switch>
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
import {getList,addProduct,updateProduct,deleteProduct,deleteListProduct,
  stop,open,flagOn,flagOff,stopList,openList} from '@/api/contract'

export default {
  name: 'contract',
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
      options:[
        {
          value:'i',
          label:'分'
        },
        {
          value:'d',
          label:'天'
        },
        {
          value:'y',
          label:'年'
        }
      ],
      activeType:'0',
      loading:false,
      formData:{},
      updateForm:{

      },
      formLine:{
        name:'',
        cycle:'',
        cycle_type:''
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
        +"&name="+this.formLine.name+"&cycle="+this.formLine.cycle+"&cycle_type="+this.formLine.cycle_type
        +"&status="+this.activeType;
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
        buy_type:row.buy_type,
        win_time:row.win_time,
        cycle:row.cycle,
        cycle_type:row.cycle_type,
        min_count:row.min_count,
        max_count:row.max_count,
        flag:row.flag,
        fee_rate:row.fee_rate,
        return_start_rate:row.return_start_rate,
        return_end_rate:row.return_end_rate,
        loss_start_rate:row.loss_start_rate,
        loss_end_rate:row.loss_end_rate,
        status:row.status
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        coin_id:'',
        buy_type:0,
        win_time:[],
        cycle:'',
        cycle_type:'',
        min_count:'',
        max_count:'',
        fee_rate:'',
        flag:true,
        return_start_rate:'',
        return_end_rate:'',
        loss_start_rate:'',
        loss_end_rate:'',
        status:true
      }
    },
    onSubmitAdd(){
      addProduct(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateProduct(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此合约删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(id).then(res=>{
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
      this.$confirm('是否删除所选择的合约？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListProduct(this.selectList).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    stopChange(row){
      if(row.status){
        open(row.id).then(res=>{
          this.$message.success(res.message);
          this.getList();
        }).catch(error=>{
          row.is_stop = false
        })
      }else{
        stop(row.id).then(res=>{
          this.$message.success(res.message);
          this.getList();
        }).catch(error=>{
          row.is_stop = true
        })
      }
    },
    flagChange(row){
      if(row.flag){
        flagOn(row.id).then(res=>{
          this.$message.success(res.message);
          this.getList();
        }).catch(error=>{
          row.flag = false
        })
      }else{
        flagOff(row.id).then(res=>{
          this.$message.success(res.message);
          this.getList();
        }).catch(error=>{
          row.flag = true
        })
      }
    },
    stopList(){
      stopList(this.selectList).then(res=>{
        this.$message.success(res.message);
        this.getList();
      })
    },
    openList(){
      openList(this.selectList).then(res=>{
        this.$message.success(res.message);
        this.getList();
      })
    }
  }
}
</script>

<style scoped>

</style>

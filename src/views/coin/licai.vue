<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="产品标题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加产品</el-button>
    </div>
    <el-dialog
      title="添加产品"
      :visible.sync="dialogShow"
      width="650px">
      <el-form :model="formData" ref="infoForm" label-width="100px" >
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="formData.name" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="对应币种" prop="coin_type">
          <el-select v-model="formData.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间周期" prop="start_at">
          <el-date-picker
            v-model="formData.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="formData.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封闭天数" prop="days">
          <el-input v-model="formData.days" style="width: 100px;"></el-input> 天
        </el-form-item>
        <el-form-item label="发行总数" prop="total_num">
          <el-input v-model="formData.total_num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="最低购买" prop="min_num">
          <el-input v-model="formData.min_num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="年化收益" prop="return_rate">
          <el-input v-model="formData.return_rate" style="width: 100px;"></el-input>%
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改产品信息"
      :visible.sync="dialogShow2"
      width="650px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px">
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="updateForm.name" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="对应币种" prop="coin_type">
          <el-select v-model="updateForm.coin_id" placeholder="请选择">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间周期" prop="start_at">
          <el-date-picker
            v-model="updateForm.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="updateForm.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封闭天数" prop="days">
          <el-input v-model="updateForm.days" style="width: 100px;"></el-input> 天
        </el-form-item>
        <el-form-item label="发行总数" prop="total_num">
          <el-input v-model="updateForm.total_num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="最低购买" prop="min_num">
          <el-input v-model="updateForm.min_num" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="年化收益" prop="return_rate">
          <el-input v-model="updateForm.return_rate" style="width: 100px;"></el-input>%
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="updateForm.status" :active-value="1" :inactive-value="0"></el-switch>
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
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="产品名称"
          fixed="left"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="coinName"
          label="对应币种"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="days"
          label="封闭天数"
          align="center"
          width="80">
          <template slot-scope="{row}">
            {{row.days}} 天
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          width="160"
          label="时间周期">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">开始时间：</div><div>{{row.start_time}}</div>
            <div style="font-size: 12px;color: #42b983;">结束时间：</div><div>{{row.end_time}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_num"
          label="发行总量"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="min_num"
          label="最低购量"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="selled_num"
          label="已申购量"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="return_rate"
          label="年化收益"
          align="center"
          width="80">
          <template slot-scope="{row}">
            {{row.return_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.status">开启</el-tag>
            <el-tag type="info" v-else>关闭</el-tag>
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
import {getList,addLicai,updateLicai,deleteLicai} from '@/api/licai'

export default {
  name: 'licai',
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
      activeType:'0',
      loading:false,
      formData:{
        name:'',
        days:'',
        total_num:'',
        min_num:'',
        coin_id:'',
        return_rate:'',
        start_time:'',
        end_time:'',
        status:1
      },
      updateForm:{

      },
      formLine:{
        name:''
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
        +"&name="+this.formLine.name+"&status="+this.activeType;
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
      this.dialogShow = true;
    },
    handleEdit(row){
      this.updateForm = {
        id:row.id,
        name:row.name,
        days:row.days,
        total_num:row.total_num,
        min_num:row.min_num,
        coin_id:row.coin_id,
        return_rate:row.return_rate,
        start_time:row.start_time,
        end_time:row.end_time,
        status:row.status
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        name:'',
        days:'',
        total_num:'',
        min_num:'',
        coin_id:'',
        return_rate:'',
        start_time:'',
        end_time:'',
        status:1
      }
    },
    onAddRow(form){
      form.options.push({
        num:'',
        type:''
      });
    },
    onDeleteRow(form,index){
      form.options.splice(index, 1);
    },
    onSubmitAdd(){
      addLicai(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateLicai(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此产品删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLicai(id).then(res=>{
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
    }
  }
}
</script>

<style scoped>

</style>

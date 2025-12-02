<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.name" placeholder="币种名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加币种</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopRechargeList" round>停用充值</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openRechargeList" round>启用充值</el-button>
    </div>
    <el-dialog
      title="添加币种"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="币种别名" prop="alias">
          <el-input v-model="formData.alias"></el-input>
        </el-form-item>
        <el-form-item label="K线类型" prop="coin_type">
          <el-input v-model="formData.coin_type"></el-input>
        </el-form-item>
        <el-form-item label="保证金" prop="bond">
          <el-input v-model="formData.bond"></el-input>
        </el-form-item>
        <el-form-item label="初始价格" prop="coin_price">
          <el-input v-model="formData.coin_price"></el-input>
        </el-form-item>
        <el-form-item label="互转费率" prop="coin_rate">
          <el-input v-model="formData.transfer_fee" style="width: 120px;"></el-input> %
        </el-form-item>
        <el-form-item label="互转最低量" prop="coin_rate">
          <el-input v-model="formData.transfer_min"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="sort_num">
          <el-input v-model="formData.sort_num"></el-input>
        </el-form-item>
        <el-form-item label="首页推荐" prop="is_home">
          <el-switch v-model="formData.is_home"></el-switch>
        </el-form-item>
        <el-form-item label="允许互转" prop="is_transfer">
          <el-switch v-model="formData.is_transfer"></el-switch>
        </el-form-item>
        <el-form-item label="允许充值" prop="is_recharge">
          <el-switch v-model="formData.is_recharge"></el-switch>
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
      title="修改币种信息"
      :visible.sync="dialogShow2"
      width="500px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="币种别名" prop="alias">
          <el-input v-model="updateForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="K线类型" prop="coin_type">
          <el-input v-model="updateForm.coin_type"></el-input>
        </el-form-item>
        <el-form-item label="保证金" prop="bond">
          <el-input v-model="updateForm.bond"></el-input>
        </el-form-item>
        <el-form-item label="初始价格" prop="coin_price">
          <el-input v-model="updateForm.coin_price"></el-input>
        </el-form-item>
        <el-form-item label="互转费率" prop="coin_rate">
          <el-input v-model="updateForm.transfer_fee" style="width: 120px;"></el-input> %
        </el-form-item>
        <el-form-item label="互转最低量" prop="coin_rate">
          <el-input v-model="updateForm.transfer_min"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="phone">
          <el-input v-model="updateForm.sort_num"></el-input>
        </el-form-item>
        <el-form-item label="首页推荐" prop="is_home">
          <el-switch v-model="updateForm.is_home"></el-switch>
        </el-form-item>
        <el-form-item label="允许互转" prop="is_transfer">
          <el-switch v-model="updateForm.is_transfer"></el-switch>
        </el-form-item>
        <el-form-item label="允许充值" prop="is_recharge">
          <el-switch v-model="updateForm.is_recharge"></el-switch>
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
          prop="name"
          label="币种名称"
          min-width="200">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="headers"
                :data="scope.row"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :on-error="handelLogoError">
                 <img v-if="scope.row.logo" :src="scope.row.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="margin-left: 10px;">{{scope.row.name}}({{scope.row.alias}})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="coin_type"
          label="K线类型"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="bond"
          label="保证金"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="coin_price"
          label="初始价格"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="transfer_fee"
          label="互转费率"
          align="center"
          width="80">
          <template slot-scope="{row}">
            {{ row.transfer_fee }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_min"
          label="互转最低量"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="sort_num"
          label="排序"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="is_home"
          label="首页推荐"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_home" @change="homeChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="允许互转"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_transfer" @change="transferChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="允许充值"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_recharge" @change="stopRechargeChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="启用状态"
          align="center"
          width="80">
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
import {getList,addCoin,updateCoin,deleteCoin,deleteListCoin,openRecharge,stopRecharge,
  openRechargeList,stopRechargeList,stop,open,stopList,openList,openTransfer,stopTransfer,
  openHome,stopHome} from '@/api/coin'
import { getToken } from '@/utils/auth'

export default {
  name: 'coin',
  data(){
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + 'coin/upload/logo',
      headers:{
        Authorization:'Bearer '+getToken()
      },
      dialogShow:false,
      dialogShow2:false,
      tableData: [],
      page:1,
      pagesize:20,
      meta:{
        total:0
      },
      activeType:'-1',
      loading:false,
      formData:{
        name:'',
        coin_type:'',
        coin_type_val:'',
        bond:'',
        coin_price:'',
        sort_num:'',
        transfer_fee:'',
        transfer_min:'',
        is_transfer:false,
        is_home:false,
        is_recharge:false,
        status:true
      },
      updateForm:{

      },
      formLine:{
        name:''
      },
      selectList:[]
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
      this.activeType = val;
      this.page = 1;
      this.getList();
    },
    getList(){
      var param = 'page='+this.page+"&pagesize="+this.pagesize
        +"&name="+this.formLine.name;
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
        alias:row.alias,
        coin_type:row.coin_type,
        coin_type_val:row.coin_type_val,
        bond:row.bond,
        coin_price:row.coin_price,
        sort_num:row.sort_num,
        transfer_fee:row.transfer_fee,
        transfer_min:row.transfer_min,
        is_home:row.is_home,
        is_transfer:row.is_transfer,
        is_recharge:row.is_recharge,
        status:row.status
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        logo:"",
        name:'',
        alias:'',
        coin_type:'',
        bond:'',
        coin_price:'',
        sort_num:'',
        transfer_fee:'',
        transfer_min:'',
        is_home:false,
        is_transfer:false,
        is_recharge:false,
        status:true
      }
    },
    onSubmitAdd(){
      addCoin(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateCoin(this.updateForm).then(res=>{
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id){
      this.$confirm('是否将此币种删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCoin(id).then(res=>{
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
      this.$confirm('是否删除所选择的币种？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListCoin(this.selectList).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    stopRechargeChange(row){
      if(row.is_recharge){
        openRecharge(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_recharge = false
        })
      }else{
        stopRecharge(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_recharge = true
        })
      }
    },
    stopRechargeList(){
      stopRechargeList(this.selectList).then(res=>{
        this.$message.success(res.message);
        this.getList();
      })
    },
    openRechargeList(){
      openRechargeList(this.selectList).then(res=>{
        this.$message.success(res.message);
        this.getList();
      })
    },
    homeChange(row){
      if(row.is_home){
        openHome(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_home = false
        })
      }else{
        stopHome(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_home = true
        })
      }
    },
    stopChange(row){
      if(row.status){
        open(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.status = false
        })
      }else{
        stop(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.status = true
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
    },
    handleLogoSuccess(res,file){
      var data = res.data;
      for(var i=0;i<this.tableData.length;i++){
        var item = this.tableData[i];
        if(item.id == data.id){
          item.logo = data.path;
          break;
        }
      }
    },
    handelLogoError(err, file, fileList){
      this.$message.error(JSON.parse(err.message).message)
    },
    transferChange(row){
      if(row.is_transfer){
        openTransfer(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_transfer = false
        })
      }else{
        stopTransfer(row.id).then(res=>{
          this.$message.success(res.message);
        }).catch(error=>{
          row.is_transfer = true
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

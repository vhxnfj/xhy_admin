<template>
  <div class="app-container">
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加银行</el-button>
      <el-button type="default" icon="el-icon-refresh" @click="loadList" round>刷新列表</el-button>
    </div>

    <el-dialog
      :title="formData.id ? '编辑银行信息' : '添加银行信息'"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 550px;">
        <el-form-item label="银行名称" prop="name">
          <el-input v-model="formData.name" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="英文简称" prop="code">
          <el-input v-model="formData.code" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="费率" prop="fee">
          <el-input v-model="formData.fee" style="width: 100px;"></el-input> %
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="submiting" :loading="submiting">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="app-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="logo"
          label="银行Logo"
          width="90">
          <template slot-scope="{row}">
            <div>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="headers"
                :show-file-list="false"
                accept="image/*"
                :data="{id:row.id}"
                :on-success="handleLogoSuccess"
                :on-error="handelLogoError">
                <img v-if="row.logo" :src="row.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="logo"
          label="银行图标(60X180)"
          width="200">
          <template slot-scope="{row}">
            <div>
              <el-upload
                class="avatar-uploader avatar-uploader2"
                :action="uploadUrl2"
                :headers="headers"
                :show-file-list="false"
                accept="image/*"
                :data="{id:row.id}"
                :on-success="handleLogoSuccess2"
                :on-error="handelLogoError">
                <img v-if="row.icon" :src="row.icon" style="width: 180px;" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="银行名称">
        </el-table-column>
        <el-table-column prop="code" label="英文简称">
        </el-table-column>
        <el-table-column prop="fee" label="费率">
          <template slot-scope="{row}">
            {{row.fee}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="sort_num"
          label="排序">
          <template slot-scope="{row}">
            <el-tooltip content="修改后自动保存" placement="left">
              <el-input v-model="row.sortnum" @change="changeInput(row)"></el-input>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_stop"
          label="停用"
          width="100">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_stop" @change="stopChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="190">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleUpdate(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {getBank,addBank,updateBank,deleteBank,updateStop,updateStart,updateSort} from '@/api/bank'

  export default {
    name: 'bank',
    data(){
      return {
        uploadUrl:process.env.VUE_APP_BASE_API + 'bank/logoUpload',
        uploadUrl2:process.env.VUE_APP_BASE_API + 'bank/iconUpload',
        formData:{},
        dialogShow:false,
        headers:{
          Authorization:'Bearer '+getToken()
        },
        tableData:[],
        loading:false,
        submiting:false
      }
    },
    created() {
      this.loadList();
    },
    methods:{
      handleAdd(){
        this.formData = {
          name:'',
          code:'',
          fee:''
        };
        this.dialogShow = true;
      },
      handleUpdate(data){
        this.formData = {
          id:data.id,
          name:data.name,
          code:data.code,
          fee:data.fee
        };
        this.dialogShow = true;
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
      handleLogoSuccess2(res,file){
        var data = res.data;
        for(var i=0;i<this.tableData.length;i++){
          var item = this.tableData[i];
          if(item.id == data.id){
            item.icon = data.path;
            break;
          }
        }
      },
      handelLogoError(err, file, fileList){
        this.$message.error(JSON.parse(err.message).message)
      },
      loadList(){
        this.loading = true;
        getBank().then(res=>{
          this.loading = false;
          this.tableData = res.data;
        }).catch(error=>{
          this.loading = false;
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.formData.id){
          updateBank(this.formData).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.$message.success(res.message);
            this.loadList();
          }).catch(error=>{
            this.submiting = false;
          });
        }else {
          addBank(this.formData).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.$message.success(res.message);
            this.loadList();
          }).catch(error=>{
            this.submiting = false;
          });
        }
      },
      onDelete(id){
        this.$confirm('是否删除所选择的支付接口？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBank(id).then(res=>{
            this.loadList();
            this.$message.success(res.message);
          });
        })
      },
      stopChange(row){
        if(row.is_stop){
          updateStop(row.id).catch(error=>{
            row.is_stop = false;
          })
        }else{
          updateStart(row.id).catch(error=>{
            row.is_stop = true;
          })
        }
      },
      changeInput(row){
        updateSort({id:row.id,sortnum:row.sortnum}).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      }
    }
  }
</script>

<style scoped>

</style>

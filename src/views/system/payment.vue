<template>
  <div class="app-container">
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加接口</el-button>
      <el-button type="default" icon="el-icon-refresh" @click="loadList" round>刷新列表</el-button>
    </div>

    <el-dialog
      :title="formData.id ? '接口编辑' : '添加接口'"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 550px;">
        <el-form-item label="接口名称" prop="title">
          <el-input v-model="formData.title" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="short_name">
          <el-input v-model="formData.short_name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="充值类型" prop="type">
          <el-select v-model="formData.pay_type" placeholder="请选择类型" >
            <el-option :label="item.title" :value="item.value" v-for="(item,index) in paymentTypeList" :key="'type_'+index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调用类名" prop="name">
          <el-input v-model="formData.name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="APPID" prop="appid">
          <el-input v-model="formData.appid"></el-input>
          <div>某些平台叫商户号</div>
        </el-form-item>
        <el-form-item label="加密密钥" prop="secret">
          <el-input v-model="formData.secret"></el-input>
        </el-form-item>
        <el-form-item label="其它密钥" prop="other_key">
          <el-input v-model="formData.other_key"></el-input>
          <div>可选，某些平台有多种加密方式时使用</div>
        </el-form-item>
        <el-form-item label="支付通道" prop="other_type">
          <el-input v-model="formData.other_type"></el-input>
          <div>可选，同一平台使用多种支付类型配置时使用</div>
        </el-form-item>
        <el-form-item label="请求地址" prop="post_url">
          <el-input v-model="formData.post_url"></el-input>
        </el-form-item>
        <el-form-item label="最低充值" prop="start_amount">
          <el-input v-model="formData.start_amount" style="width: 100px;"></el-input> 元，设置为0则不限制
        </el-form-item>
        <el-form-item label="最高充值" prop="fee">
          <el-input v-model="formData.end_amount" style="width: 100px;"></el-input> 元，设置为0则不限制
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
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="logo"
          label="接口图标"
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
        <el-table-column prop="title" label="接口名称">
        </el-table-column>
        <el-table-column prop="short_name" label="简称">
        </el-table-column>
        <el-table-column prop="pay_type" label="充值类型">
          <template scope="{row}">
            {{paymentTypeList[row.pay_type].title}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="调用名称">
        </el-table-column>
        <el-table-column prop="fee" label="费率">
          <template slot-scope="{row}">
            {{row.fee}}%
          </template>
        </el-table-column>
        <el-table-column prop="start_amount" label="起充金额">
        </el-table-column>
        <el-table-column prop="end_amount" label="最高充值">
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
  import {getPayment,addPayment,updatePayment,deletePayment,updateStop,updateStart,updateSort} from '@/api/payment'

  export default {
    name: 'payment',
    data(){
      return {
        uploadUrl:process.env.VUE_APP_BASE_API + 'payment/logoUpload',
        formData:{},
        dialogShow:false,
        headers:{
          Authorization:'Bearer '+getToken()
        },
        tableData:[],
        loading:false,
        submiting:false,
        paymentTypeList:[
          {
            title:"快捷",
            value:0
          },
          {
            title:"支付宝",
            value:1
          },
          {
            title:"微信",
            value:2
          },
          {
            title:"银行卡",
            value:3
          }
        ]
      }
    },
    created() {
      this.loadList();
    },
    methods:{
      handleAdd(){
        this.formData = {
          title:'',
          name:'',
          appid:'',
          secret:'',
          other_key:'',
          other_type:'',
          post_url:'',
          start_amount:'',
          end_amount:'',
          fee:'',
          pay_type:0
        };
        this.dialogShow = true;
      },
      handleUpdate(data){
        this.formData = {
          id:data.id,
          title:data.title,
          short_name:data.short_name,
          name:data.name,
          appid:data.appid,
          secret:data.secret,
          other_key:data.other_key,
          other_type:data.other_type,
          post_url:data.post_url,
          start_amount:data.start_amount,
          end_amount:data.end_amount,
          fee:data.fee,
          pay_type:data.pay_type
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
      handelLogoError(err, file, fileList){
        this.$message.error(JSON.parse(err.message).message)
      },
      loadList(){
        this.loading = true;
        getPayment().then(res=>{
          this.loading = false;
          this.tableData = res.data;
        }).catch(error=>{
          this.loading = false;
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.formData.id){
          updatePayment(this.formData).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.$message.success(res.message);
            this.loadList();
          }).catch(error=>{
            this.submiting = false;
          });
        }else {
          addPayment(this.formData).then(res=>{
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
          deletePayment(id).then(res=>{
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

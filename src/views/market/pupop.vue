<template>
  <div class="app-container">
    <el-card class="app-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="广告图片">
          <el-upload
            class="avatar-uploader pupop-uploader"
            :action="imageupload_path"
            :headers="upload_header"
            name="imagefile"
            :show-file-list="false"
            :on-success="imgageUploaded">
            <img v-if="form.logo" :src="form.logo" style="width: 300px;height: 400px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="开始时间" prop="created_at">
          <el-date-picker
            v-model="form.start_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="created_at">
          <el-date-picker
            v-model="form.end_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跳转地址">
          <el-input v-model="form.jumpurl" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="图片宽度">
          <el-input v-model="form.width" style="width: 100px"></el-input> px 最大750
        </el-form-item>
        <el-form-item label="图片高度">
          <el-input v-model="form.height" style="width: 100px"></el-input> px
        </el-form-item>
        <el-form-item label="停用">
          <el-switch v-model="form.is_stop"></el-switch>
        </el-form-item>
      </el-form>
      <el-button @click="saveInfo()" type="primary" :loading="saving" :disabled="saving">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import {getToken} from '@/utils/auth'
import {getPopup,savePopup} from "@/api/market";

export default {
  name: "pupop",
  data(){
    return {
      imageupload_path:process.env.VUE_APP_BASE_API + 'lunbo/upload',
      upload_header:{
        Authorization:'Bearer '+getToken()
      },
      saving:false,
      form:{
        logo:'',
        jumpurl:'',
        width:'',
        height:'',
        start_at:'',
        end_at:'',
        is_stop:false
      }
    }
  },
  created() {
    this.getInfo()
  },
  activated() {
    this.getInfo()
  },
  methods:{
    imgageUploaded(response, file,){
      if(response.code != 200){
        this.$message.error(response.message);
        return;
      }
      this.form.logo = response.data.url;
    },
    getInfo(){
      getPopup().then(res=>{
        if (res.data){
          this.form = res.data
        }
      })
    },
    saveInfo(){
      this.saving = true;
      savePopup(this.form).then(res=>{
        this.saving = false;
        this.$message({
          message: res.message,
          type: 'success'
        });
        this.loadList();
      }).catch(res=>{
        this.saving = false;
      });
    }
  }
}
</script>

<style scoped>

</style>

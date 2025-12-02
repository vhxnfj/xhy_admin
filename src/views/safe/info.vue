<template>
  <div class="app-container">
    <el-card class="app-container">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 300px;">
        <el-form-item label="显示头像" prop="avatar">
          <el-avatar shape="square" :size="100" :src="formData.avatar ? formData.avatar : 'images/default.gif'"></el-avatar>
          <el-button type="primary" plain @click="imagecropperShow=true">修改头像</el-button>
        </el-form-item>
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <image-cropper field="img"
                   :width="300"
                   :height="300"
                   :url="uploadUrl"
                   :key="imagecropperKey"
                   :headers="headers"
                   :value.sync="imagecropperShow"
                   img-format="png"
                   @close="closeUpload"
                   @crop-upload-success="cropSuccess"></image-cropper>
  </div>
</template>

<script>
  import ImageCropper from '@/components/ImageCropper'
  import {getInfo,alterInfo} from '@/api/user'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'info',
    components:{
      ImageCropper
    },
    data(){
      return {
        uploadUrl:process.env.VUE_APP_BASE_API + 'avatarUpload',
        imagecropperShow: false,
        imagecropperKey:0,
        headers: {
          smail: '*_~'
        },
        imgDataUrl: '',
        formData:{
          avatar:'',
          name:'',
          gender:'',
          phone:''
        }
      }
    },
    created() {
      this.loadInfo();
    },
    activated() {
      this.loadInfo();
    },
    methods: {
      loadInfo(){
        getInfo().then(res=>{
          var {avatar,name,phone} = res.data;
          this.formData = {
            avatar,name,phone
          }
        });
      },
      cropSuccess(resData) {
        this.imagecropperShow = false;
        this.imagecropperKey = this.imagecropperKey + 1;
        this.formData.avatar = resData;
      },
      closeUpload() {
        this.imagecropperShow = false
      },
      onSubmit(){
        alterInfo(this.formData).then(res=>{
          this.$message.success("资料更新成功！");
          this.$store.dispatch("user/updateInfo",res.data);
        });
      }
    }
  }
</script>

<style scoped>

</style>

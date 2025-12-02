<template>
  <div class="app-container">
    <el-card class="app-container">
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="formData.title" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="阅读次数">
          <el-input v-model="formData.read_count" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-switch v-model="formData.is_top"></el-switch>
        </el-form-item>
        <el-form-item label="文章状态">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
        <el-form-item label="发布时间" prop="created_at">
          <el-date-picker
            v-model="formData.created_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div ref="editor"></div>
      <div style="padding: 30px 0px;">
        <el-button type="primary" @click="onSubmit" :disabled="isSubmiting" :loading="isSubmiting">立即发布</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import E from 'wangeditor'
import {addArticle,updateArticle,getArticle} from "@/api/article";
import {getToken} from "@/utils/auth";

var editor;

export default {
  name: "editArticle",
  data(){
    return {
      formData:{
        id:'',
        title:'',
        read_count:'',
        is_top:false,
        status:true,
        content:'',
        created_at:''
      },
      isSubmiting:false
    }
  },
  mounted() {
    editor = new E(this.$refs.editor);
    editor.config.uploadImgServer = process.env.VUE_APP_BASE_API + 'article/uploadImage';
    editor.config.uploadFileName = 'file';
    editor.config.uploadImgHeaders = {
      Authorization:'Bearer '+getToken()
    }
    editor.config.uploadImgHooks = {
      fail:(xhr, editor, resData)=>{
        this.$message.error(resData.message)
      }
    }
    editor.create();
    var id = this.$route.query.id;
    if (id){
      getArticle(id).then(res=>{
        this.formData = res.data;
        editor.txt.html(res.data.content);
      }).catch(error =>{

      })
    }
  },
  created() {

  },
  methods:{
    onSubmit(){
      if (this.isSubmiting) return;
      this.formData.content = editor.txt.html();
      this.isSubmiting = true;
      if (this.formData.id){
        updateArticle(this.formData).then(res=>{
          this.isSubmiting = false;
          this.$message.success(res.message);
        }).catch(error =>{
          this.isSubmiting = false;
        })
      }else{
        addArticle(this.formData).then(res=>{
          this.isSubmiting = false;
          this.$message.success(res.message);
          editor.txt.html('');
          this.formData = {
            title:'',
            read_count:'',
            is_top:false,
            status:true,
            content:'',
            created_at:''
          };
        }).catch(error =>{
          this.isSubmiting = false;
        })
      }

    }
  }
}
</script>

<style scoped>

</style>

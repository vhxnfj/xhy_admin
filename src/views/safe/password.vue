<template>
  <div class="app-container">
    <el-card class="app-container">
      <el-form ref="form" :model="form" label-width="100px" style="width: 500px;">
        <el-form-item label="旧密码" prop="oldpassword">
          <el-input v-model="form.oldpassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input v-model="form.newpassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="password_confirm">
          <el-input v-model="form.password_confirm" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {alterPassword} from '../../api/user'

  export default {
    name: 'password',
    data(){
      return {
        form:{
          oldpassword:'',
          newpassword:'',
          password_confirm:''
        }
      }
    },
    methods:{
      onSubmit(){
        alterPassword(this.form).then(res=>{
          this.$message.success(res.message);
          this.resetForm();
          //修改成功后退出登陆
          this.$store.dispatch('user/resetToken')
          this.$router.push('/login')
        })
      },
      resetForm(){
        this.$refs['form'].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>

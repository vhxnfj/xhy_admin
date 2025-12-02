<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
  .body-box .el-card__body{
    padding: 0px;
  }
  .form-sticky-bar div{
    background: #ffffff;
    padding:0px 10px;
    text-align: right;
    border-bottom: #f1f1f1 1px solid;
    height: 60px !important;
    line-height: 60px;
    box-shadow: 0px 2px 5px #dddddd;
  }
  .page-tab-box{
    padding-bottom:10px;
  }
  .toolbar-box{
    padding-bottom:20px;
  }
  .search-box{
    padding-bottom:0px;
    text-align: right;
  }
  .pagination-box{
    padding: 20px;
  }
  .avatar-uploader .el-upload,.link-uploader .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .link-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .pupop-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 400px;
    line-height: 400px;
    text-align: center;
  }

  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
  .w-e-toolbar{
    z-index: 1001 !important;
  }
  .w-e-text-container{
    z-index: 1000 !important;
  }
</style>

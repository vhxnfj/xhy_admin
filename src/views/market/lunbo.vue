<template>
  <div>
    <sticky class="form-sticky-bar" :sticky-top="80">
      <span style="color:#409EFF;font-size: 14px;margin-right: 20px;">修改和新添加了数据记得保存哦</span>
      <el-button type="primary" icon="el-icon-success" @click="onSubmit" :loading="saving" :disabled="saving">保存</el-button>
    </sticky>
    <div class="app-container">
      <el-card class="app-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading">
          <el-table-column
            prop="logo"
            width="190"
            align="center"
            label="图片(750X350)">
            <template slot-scope="scope">
              <el-upload
                class="avatar-uploader avatar-uploader2"
                :action="imageupload_path"
                :headers="upload_header"
                :data="{index:scope.$index}"
                :on-preview="handlePictureCardPreview"
                :show-file-list="false"
                name="imagefile"
                :on-success="imgageUploaded"
                :on-remove="handleRemove">
                <img v-if="scope.row.logo" :src="scope.row.logo" style="width: 180px;" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="广告类型"
            width="180"
            align="center">
            <template slot-scope="{row}">
              <el-select v-model="row.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="图片高度"
            width="140"
            align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.height" style="width: 80px;"></el-input> px
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="跳转地址(可选)"
            min-width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.jumpurl"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            label="开始时间">
            <template slot-scope="{row}">
              <el-date-picker
                v-model="row.start_at"
                type="date"
                style="width: 150px;"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            label="结束时间">
            <template slot-scope="{row}">
              <el-date-picker
                v-model="row.end_at"
                type="date"
                style="width: 150px;"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            label="停用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_stop">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            min-width="300">
            <template slot-scope="scope">
              <el-button @click="sortList(scope.$index,'top')" icon="el-icon-top" size="mini" type="primary" plain>顶</el-button>
              <el-button @click="sortList(scope.$index,'up')" icon="el-icon-top" size="mini">上</el-button>
              <el-button @click="sortList(scope.$index,'down')" icon="el-icon-bottom" size="mini">下</el-button>
              <el-button @click="sortList(scope.$index,'bottom')" icon="el-icon-bottom" size="mini" type="primary" plain>底</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-button-box">
          <el-button @click="addRow" icon="el-icon-plus">添加</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {saveLunbo,getLunbo} from '@/api/market'
  import {getToken} from '@/utils/auth'
  import Sticky from '@/components/Sticky'

  export default {
    name: "lunbo",
    components: { Sticky },
    data(){
      return {
        tableData: [],
        deleteList:[],
        saving:false,
        loading:false,
        imageupload_path:process.env.VUE_APP_BASE_API + 'lunbo/upload',
        upload_header:{
          Authorization:'Bearer '+getToken()
        },
        dialogImageUrl: '',
        dialogVisible: false,
        options: [{
          value: 'lunbo',
          label: '轮播广告'
        },{
          value: 'home',
          label: '首页广告'
        },{
          value: 'trade',
          label: '交易页广告'
        },{
          value: 'gengdan',
          label: '跟单页广告'
        },{
          value: 'ucenter',
          label: '用户中心广告'
        },{
          value: 'wakuang',
          label: '挖矿宝'
        },{
          value: 'licai',
          label: '理财中心'
        },{
          value: 'bibi',
          label: '法币交易'
        },{
          value: 'grid_contract',
          label: '合约网格'
        },{
          value: 'infinite',
          label: '无限网格'
        }]
      }
    },
    created(){
      this.loadList();
    },
    methods:{
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      loadList(){
        this.loading = true;
        getLunbo().then(res=>{
          this.loading = false;
          this.tableData = res.data;
        }).catch(error=>{
          this.loading = false;
        });
      },
      addRow(){
        this.tableData.push({
          id:0,
          jumpurl:'',
          start_at:'',
          end_at:'',
          is_stop:false,
          logo:'',
          type:'lunbo',
          height:'',
          sort:this.tableData.length,
        });
      },
      deleteRow(index,row){
        if(row.id) this.deleteList.push(row.id);
        this.tableData.splice(index,1);
      },
      sortList(index,action){
        switch (action) {
          case 'up':
            if(index>0){
              var upitem = this.tableData[index-1];
              var nowitem = this.tableData[index];
              upitem.sort++;
              nowitem.sort--;
              this.tableData.splice(index-1,2,nowitem,upitem);
            }
            break;
          case 'down':
            if(index<this.tableData.length-1){
              var downitem = this.tableData[index+1];
              var nowitem = this.tableData[index];
              downitem.sort++;
              nowitem.sort--;
              this.tableData.splice(index,2,downitem,nowitem);
            }
            break;
          case 'top':
            if(index>0){
              var nowitem = this.tableData[index];
              this.tableData.splice(index,1);
              this.tableData.unshift(nowitem);
              for(var i=0;i<this.tableData.length;i++){
                this.tableData[i].sort = i;
              }
            }
            break;
          case 'bottom':
            if(index<this.tableData.length-1){
              var nowitem = this.tableData[index];
              this.tableData.splice(index,1);
              this.tableData.push(nowitem);
              for(var i=0;i<this.tableData.length;i++){
                this.tableData[i].sort = i;
              }
            }
            break;
        }
      },
      onSubmit(){
        this.saving = true;
        saveLunbo({data:this.tableData,deletelist:this.deleteList}).then(res=>{
          this.saving = false;
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.loadList();
        }).catch(res=>{
          this.saving = false;
        });
      },
      handleRemove(file, fileList){console.log(file);
        var url = file.response ? file.response.data : file.url;
      },
      imgageUploaded(response, file,){
        if(response.code != 200){
          this.$message.error(response.message);
          return;
        }
        var index = parseInt(response.data.index);
        this.tableData[index].logo = response.data.url;
      }
    }
  }
</script>

<style scoped>
  .add-button-box{
    padding: 10px;
    text-align: center;
  }
  .category-uploader-icon{
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: #f1f1f1 1px solid;
    background: white;
  }
  .category-image{
    width: 60px;
    height: 60px;
  }
</style>

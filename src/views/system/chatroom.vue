<template>
  <div class="app-container">
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加聊天室</el-button>
      <el-button type="default" icon="el-icon-refresh" @click="loadList" round>刷新列表</el-button>
    </div>

    <el-dialog
      :title="formData.id ? '编辑聊天室' : '添加聊天室'"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 550px;">
        <el-form-item label="聊天室名称" prop="title">
          <el-input v-model="formData.title" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="房间人数" prop="max_count">
          <el-input v-model="formData.max_count" style="width: 100px;"></el-input>人
        </el-form-item>
        <el-form-item label="初始人数" prop="start_count">
          <el-input v-model="formData.start_count" style="width: 100px;"></el-input>人
        </el-form-item>
        <el-form-item label="保证金" prop="bond">
          <el-input v-model="formData.bond" style="width: 100px;"></el-input>U
        </el-form-item>
        <el-form-item label="胜率" prop="bond">
          <el-input v-model="formData.success_rate" style="width: 100px;"></el-input>%
        </el-form-item>
        <el-form-item label="带单员" prop="admin_name">
          <el-input v-model="formData.admin_name" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="房间密码" prop="room_pass">
          <el-input v-model="formData.room_pass" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="允许聊天" prop="is_speech">
          <el-switch v-model="formData.is_speech"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="submiting" :loading="submiting">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="房间管理员管理"
      :visible.sync="dialogShow1"
      width="600px">
      <div style="padding-bottom: 10px;">
        <el-input v-model="searchKeyword" style="width: 200px;" placeholder="请输入用户名"></el-input>
        <el-button type="success"
                   @click="addUserInto(roomData,'admin')"
                   :disabled="isSubmiting"
                   :loading="isSubmiting">添加</el-button>
      </div>
      <div>
        <el-tag
          v-for="(item,index) in roomData.admin_user"
          :key="item.id"
          style="margin-right: 10px;"
          closable
          @close="deleteFromAdmin(roomData,index)"
          :type="item.username">
          {{item.username}}
        </el-tag>
      </div>
    </el-dialog>

    <el-dialog
      title="房间黑名单管理"
      :visible.sync="dialogShow2"
      width="600px">
      <div style="padding-bottom: 10px;">
        <el-input v-model="searchKeyword" style="width: 200px;" placeholder="请输入用户名"></el-input>
        <el-button type="success"
                   @click="addUserInto(roomData,'black')"
                   :disabled="isSubmiting"
                   :loading="isSubmiting">添加</el-button>
      </div>
      <div>
        <el-tag
          v-for="(item,index) in roomData.black_user"
          :key="item.id"
          style="margin-right: 10px;"
          closable
          @close="deleteFromBlack(roomData,index)"
          :type="item.username">
          {{item.username}}
        </el-tag>
      </div>
    </el-dialog>

    <el-card class="app-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column fixed="left" min-width="200" prop="title" label="聊天室名称">
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
              <span style="margin-left: 10px;">{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="max_count" label="房间人数">
        </el-table-column>
        <el-table-column prop="online_count" label="在线人数">
        </el-table-column>
        <el-table-column prop="start_count" label="初始人数">
        </el-table-column>
        <el-table-column prop="bond" label="保证金" width="120">
          <template slot-scope="{row}">
            {{row.bond}}U
          </template>
        </el-table-column>
        <el-table-column prop="success_rate" label="胜率">
          <template slot-scope="{row}">
            {{row.success_rate}}%
          </template>
        </el-table-column>
        <el-table-column prop="admin_name" label="带单员">
        </el-table-column>
        <el-table-column prop="room_pass" label="房间密码">
        </el-table-column>
        <el-table-column
          prop="is_speech"
          label="聊天功能"
          width="100">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.is_speech">开启</el-tag>
            <el-tag type="info" v-else>关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="开启状态"
          width="100">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status" @change="stopChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="admin" label="创建人">
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
          fixed="right"
          align="center"
          label="操作"
          width="230">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleUpdate(row)">编辑房间</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除房间</el-button>
            <el-button style="margin-top: 10px;" type="primary" size="small" @click="handleAdmin(row)">房间管理员</el-button>
            <el-button style="margin-top: 10px;" type="primary" size="small" @click="handleBlack(row)">房间黑名单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getList,addChatroom,updateChatroom,deleteChatroom,
    updateStop,updateStart,searchUser,updateRoomAdmin,
    updateRoomBlack} from '@/api/chatroom'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'chatroom',
    data(){
      return {
        uploadUrl:process.env.VUE_APP_BASE_API + 'chat/uploadLogo',
        headers:{
          Authorization:'Bearer '+getToken()
        },
        formData:{},
        dialogShow:false,
        dialogShow1:false,
        dialogShow2:false,
        tableData:[],
        loading:false,
        submiting:false,
        searchKeyword:'',
        roomData:{},
        isSubmiting:false
      }
    },
    created() {
      this.loadList();
    },
    methods:{
      handleAdd(){
        this.formData = {
          title:'',
          max_count:'200',
          start_count:'',
          bond:'',
          success_rate:'',
          admin_name:'',
          room_pass:'',
          is_speech:false,
          status:true
        };
        this.dialogShow = true;
      },
      handleAdmin(row){
        this.dialogShow1 = true;
        this.roomData = row;
      },
      handleBlack(row){
        this.dialogShow2 = true;
        this.roomData = row;
      },
      addUserInto(row,type){
        this.isSubmiting = true;
        searchUser({
          room_id:row.id,
          keyword:this.searchKeyword,
          type:type
        }).then(res=>{
          this.isSubmiting = false;
          this.searchKeyword = '';
          if(type == 'admin'){
            row.admin_user.push({
              id:res.data.id,
              username:res.data.username
            });
            row.admin_list.push(res.data.id);
          }else{
            row.black_user.push({
              id:res.data.id,
              username:res.data.username
            });
            row.black_list.push(res.data.id);
          }
          this.$message.success(res.message);
        }).catch(error =>{
          this.isSubmiting = false;
        });
      },
      deleteFromAdmin(row,index){
        row.admin_list.splice(index, 1);
        row.admin_user.splice(index, 1);
        updateRoomAdmin({
          room_id:row.id,
          list:row.admin_list
        }).then(res=>{
          this.$message.success(res.message)
        })
      },
      deleteFromBlack(row,index){
        row.black_list.splice(index, 1);
        row.black_user.splice(index, 1);
        updateRoomBlack({
          room_id:row.id,
          list:row.black_list
        }).then(res=>{
          this.$message.success(res.message)
        })
      },
      handleUpdate(data){
        this.formData = {
          id:data.id,
          title:data.title,
          max_count:data.max_count,
          start_count:data.start_count,
          bond:data.bond,
          success_rate:data.success_rate,
          admin_name:data.admin_name,
          room_pass:data.room_pass,
          is_speech:data.is_speech
        };
        this.dialogShow = true;
      },
      loadList(){
        this.loading = true;
        getList().then(res=>{
          this.loading = false;
          this.tableData = res.data;
        }).catch(error=>{
          this.loading = false;
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.formData.id){
          updateChatroom(this.formData).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.$message.success(res.message);
            this.loadList();
          }).catch(error=>{
            this.submiting = false;
          });
        }else {
          addChatroom(this.formData).then(res=>{
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
          deleteChatroom(id).then(res=>{
            this.loadList();
            this.$message.success(res.message);
          });
        })
      },
      stopChange(row){
        if(!row.status){
          updateStop(row.id).catch(error=>{
            row.status = true;
          })
        }else{
          updateStart(row.id).catch(error=>{
            row.status = false;
          })
        }
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
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加等级</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
    </div>
    <el-dialog
      title="添加等级"
      :visible.sync="dialogShow"
      width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 500px;">
        <el-form-item label="等级名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="等级级别" prop="level_num">
          <el-input v-model="formData.level_num"></el-input>
        </el-form-item>
        <el-form-item label="直推人数" prop="invit_count">
          <el-input v-model="formData.invit_count"></el-input>
        </el-form-item>
        <el-form-item label="团队人数" prop="team_count">
          <el-input v-model="formData.team_count"></el-input>
        </el-form-item>
        <el-form-item label="团队中拥有" prop="coin_rate">
          <el-input v-model="formData.must_team_num" style="width: 100px;"></el-input> 个直推达到
          <el-input v-model="formData.must_team_count" style="width: 100px;"></el-input> 个操作人数
        </el-form-item>
        <el-form-item label="团队中拥有" prop="coin_rate">
          <el-input v-model="formData.must_count" style="width: 100px;"></el-input> 个
          <el-select v-model="formData.must_level" placeholder="请选择">
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select> 会员
        </el-form-item>
        <el-form-item label="每日领取" prop="red_reward">
          <el-input v-model="formData.red_reward" style="width: 100px;"></el-input> U
        </el-form-item>
        <el-form-item label="分红奖励" prop="daili1_reward">
          <el-input v-model="formData.daili1_reward" style="width: 100px;"></el-input> %
        </el-form-item>
        <el-form-item label="提现费率" prop="daili2_reward">
          <el-input v-model="formData.daili2_reward" style="width: 100px;"></el-input> %,(不设置则使用系统设置，设置成负数表示不收手续费)
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
      width="600px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 500px;">
        <el-form-item label="等级名称" prop="title">
          <el-input v-model="updateForm.title"></el-input>
        </el-form-item>
        <el-form-item label="等级级别" prop="level_num">
          <el-input v-model="updateForm.level_num"></el-input>
        </el-form-item>
        <el-form-item label="直推人数" prop="invit_count">
          <el-input v-model="updateForm.invit_count"></el-input>
        </el-form-item>
        <el-form-item label="团队人数" prop="team_count">
          <el-input v-model="updateForm.team_count"></el-input>
        </el-form-item>
        <el-form-item label="团队中拥有" prop="coin_rate">
          <el-input v-model="updateForm.must_team_num" style="width: 100px;"></el-input> 个直推达到
          <el-input v-model="updateForm.must_team_count" style="width: 100px;"></el-input> 个操作人数
        </el-form-item>
        <el-form-item label="团队中拥有" prop="coin_rate">
          <el-input v-model="updateForm.must_count" style="width: 100px;"></el-input> 个
          <el-select v-model="updateForm.must_level" placeholder="请选择">
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select> 会员
        </el-form-item>
        <el-form-item label="每日领取" prop="red_reward">
          <el-input v-model="updateForm.red_reward" style="width: 100px;"></el-input> U
        </el-form-item>
        <el-form-item label="分红奖励" prop="daili1_reward">
          <el-input v-model="updateForm.daili1_reward" style="width: 100px;"></el-input> %
        </el-form-item>
        <el-form-item label="提现费率" prop="daili2_reward">
          <el-input v-model="updateForm.daili2_reward" style="width: 100px;"></el-input> %,(不设置则使用系统设置，设置成负数表示不收手续费)
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
          prop="title"
          label="等级"
          fixed="left"
          min-width="200">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <el-upload
                class="link-uploader"
                :action="uploadUrl"
                :headers="headers"
                :data="scope.row"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :on-error="handelLogoError">
                <img v-if="scope.row.logo" :src="scope.row.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 50px;"></i>
              </el-upload>
              <span style="margin-left: 10px;">{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="level_num"
          label="等级级别"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="invit_count"
          label="直推人数"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="team_count"
          label="团队人数"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="must"
          label="团队要求"
          align="center"
          width="180">
          <template slot-scope="{row}">
              {{row.must_team_num}}个直推达到{{row.must_team_count}}个操作人数
          </template>
        </el-table-column>
        <el-table-column
          prop="must"
          label="团队要求"
          align="center"
          width="180">
          <template slot-scope="{row}">
            <template v-if="row.must && row.must_count">
              拥有{{row.must_count}}个{{row.must}}会员
            </template>
            <template v-else>
              无
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="red_reward"
          label="每日领取"
          align="center"
          width="120">
          <template slot-scope="{row}">
            {{ row.red_reward }}U
          </template>
        </el-table-column>
        <el-table-column
          prop="daili1_reward"
          label="分红奖励"
          align="center"
          width="120">
          <template slot-scope="{row}">
            {{ row.daili1_reward }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="daili2_reward"
          label="提现率费"
          align="center"
          width="120">
          <template slot-scope="{row}">
            {{ row.daili2_reward }}%
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
    </el-card>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {addLevel,updateLevel,getList,stop,open,stopList,openList,deleteLevel,deleteListLevel} from '@/api/level'

export default {
  name: 'level',
  data(){
    return {
      uploadUrl:process.env.VUE_APP_BASE_API + 'level/upload/logo',
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
        title:'',
        level_num:'',
        invit_count:'',
        team_count:'',
        must_level:'',
        must_count:'',
        must_team_num:'',
        must_team_count:'',
        red_reward:'',
        daili1_reward:'',
        daili2_reward:'',
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
        title:row.title,
        level_num:row.level_num,
        invit_count:row.invit_count,
        team_count:row.team_count,
        must_level:row.must_level,
        must_count:row.must_count,
        must_team_count:row.must_team_count,
        must_team_num:row.must_team_num,
        red_reward:row.red_reward,
        daili1_reward:row.daili1_reward,
        daili2_reward:row.daili2_reward,
        status:row.status
      };
      this.dialogShow2 = true;
    },
    resetForm(){
      this.formData = {
        title:'',
        invit_count:'',
        team_count:'',
        must_level:'',
        must_count:'',
        must_team_num:'',
        must_team_count:'',
        red_reward:'',
        daili1_reward:'',
        daili2_reward:'',
        status:true
      }
    },
    onSubmitAdd(){
      addLevel(this.formData).then(res=>{
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave(){
      updateLevel(this.updateForm).then(res=>{
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
        deleteLevel(id).then(res=>{
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    onDeleteList(){
      this.$confirm('是否删除所选择的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListLevel(this.selectList).then(res=>{
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
    }
  }
}
</script>

<style scoped>

</style>

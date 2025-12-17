<template>
  <div class="app-container">
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加栏目</el-button>
      <el-button type="default" icon="el-icon-refresh" @click="loadList" round>刷新列表</el-button>
    </div>

    <el-dialog :title="formData.id ? '栏目编辑' : '添加栏目'" :visible.sync="dialogShow" width="600px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 550px;">
        <el-form-item label="栏目名称" prop="title">
          <el-input v-model="formData.title" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="path">
          <el-input v-model="formData.path" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="跳转方式" prop="target">
          <el-select v-model="formData.target" placeholder="请选择">
            <el-option label="APP内打开" value="_self"></el-option>
            <el-option label="APP外打开" value="_blank"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="submiting" :loading="submiting">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="app-container">
      <el-table :data="tableData" border v-loading="loading" style="width: 100%">
        <el-table-column prop="logo" label="栏目图标" width="90">
          <template slot-scope="{row}">
            <div>
              <el-upload class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
                accept="image/*" :data="{ id: row.id }" :on-success="handleLogoSuccess" :on-error="handelLogoError">
                <img v-if="row.logo" :src="row.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="栏目名称" width="200">
        </el-table-column>
        <el-table-column prop="path" label="跳转地址">
        </el-table-column>
        <el-table-column prop="target" label="跳转方式" width="100">
        </el-table-column>
        <el-table-column prop="sort_num" label="排序" width="150">
          <template slot-scope="{row}">
            <el-tooltip content="修改后自动保存" placement="left">
              <el-input v-model="row.sort_num" @change="changeInput(row)"></el-input>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="{row}">
            <el-switch v-model="row.status" @change="stopChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
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
import { getToken } from '@/utils/auth'
import { getCategory, addCategory, updateCategory, deleteCategory, updateStop, updateStart, updateSort } from '@/api/cate'

export default {
  name: 'cate',
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + 'cate/logoUpload',
      formData: {},
      dialogShow: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      tableData: [],
      loading: false,
      submiting: false,
    }
  },
  created() {
    this.loadList();
  },
  methods: {
    handleAdd() {
      this.formData = {
        title: '',
        path: '',
        target: '_self'
      };
      this.dialogShow = true;
    },
    handleUpdate(data) {
      this.formData = {
        id: data.id,
        title: data.title,
        path: data.path,
        target: data.target
      };
      this.dialogShow = true;
    },
    handleLogoSuccess(res, file) {
      var data = res.data;
      for (var i = 0; i < this.tableData.length; i++) {
        var item = this.tableData[i];
        if (item.id == data.id) {
          item.logo = data.path;
          break;
        }
      }
    },
    handelLogoError(err, file, fileList) {
      this.$message.error(JSON.parse(err.message).message)
    },
    loadList() {
      this.loading = true;
      getCategory().then(res => {
        this.loading = false;
        this.tableData = res.data;
      }).catch(error => {
        this.loading = false;
      })
    },
    onSubmit() {
      this.submiting = true;
      if (this.formData.id) {
        updateCategory(this.formData).then(res => {
          this.submiting = false;
          this.dialogShow = false;
          this.$message.success(res.message);
          this.loadList();
        }).catch(error => {
          this.submiting = false;
        });
      } else {
        addCategory(this.formData).then(res => {
          this.submiting = false;
          this.dialogShow = false;
          this.$message.success(res.message);
          this.loadList();
        }).catch(error => {
          this.submiting = false;
        });
      }
    },
    onDelete(id) {
      this.$confirm('是否删除所选择的栏目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(id).then(res => {
          this.loadList();
          this.$message.success(res.message);
        });
      })
    },
    stopChange(row) {
      if (row.status) {
        updateStop(row.id).catch(error => {
          row.status = false;
        })
      } else {
        updateStart(row.id).catch(error => {
          row.status = true;
        })
      }
    },
    changeInput(row) {
      updateSort({ id: row.id, sort_num: row.sort_num }).then(res => {
        this.getList();
        this.$message.success(res.message);
      });
    }
  }
}
</script>

<style scoped></style>

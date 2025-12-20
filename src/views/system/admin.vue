<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.username" placeholder="名称/登陆名" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级">
          <el-input v-model="formLine.parent" placeholder="名称/登陆名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加管理员</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
    </div>
    <el-dialog title="添加管理员" :visible.sync="dialogShow" width="500px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="登陆名称" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input v-model="formData.password" show-password></el-input>
          默认密码为123456
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
        <el-form-item label="管理分组" prop="group_id">
          <el-select v-model="formData.group_id" placeholder="请选择">
            <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改管理员信息" :visible.sync="dialogShow2" width="500px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="登陆名称" prop="username">
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input v-model="updateForm.password" show-password></el-input>
          不修改密码则不用填
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="updateForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="updateForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="管理分组" prop="group_id">
          <el-select v-model="updateForm.group_id" placeholder="请选择">
            <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="-1">所有类型</el-radio-button>
          <el-radio-button :label="item.value + ''" v-for="(item, key) in groupList" :key="key">{{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-table :data="tableData" border @selection-change="handleSelectionChange" v-loading="loading"
        style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="管理员名称">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <el-avatar shape="square" :size="50"
                :src="scope.row.avatar ? scope.row.avatar : 'images/default.gif'"></el-avatar>
              <span style="margin-left: 10px;">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="登陆名称" align="center" width="120">
        </el-table-column>
        <el-table-column prop="genderName" label="性别" align="center" width="70">
        </el-table-column>
        <el-table-column prop="phone" align="center" label="联系电话" width="110">
          <template slot-scope="{row}">{{ row.phone ? row.phone : '-' }}</template>
        </el-table-column>
        <el-table-column prop="groupName" label="管理组" align="center" width="110">
        </el-table-column>
        <el-table-column prop="parent" label="上级管理员" align="center" width="110">
        </el-table-column>
        <el-table-column prop="is_stop" label="停用" align="center" width="80">
          <template slot-scope="{row}">
            <el-switch v-model="row.is_stop" @change="stopChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <!--        <el-table-column
          prop="open_google"
          label="谷歌验证"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.open_google">
            </el-switch>
          </template>
        </el-table-column>-->
        <el-table-column prop="created_at" width="160" label="时间">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">创建时间：</div>
            <div>{{ row.created_at }}</div>
            <div style="font-size: 12px;color: #42b983;">最后修改：</div>
            <div>{{ row.updated_at }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="toggleGoogle(row)">Google验证</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-size="pagesize"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="meta.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="谷歌验证器" :visible.sync="dialogGoogle" width="500px" @close="googleInfo = null">
      <div class="google_box" v-if="googleInfo">
        <div v-if="!googleInfo.have_secret">
          <p class="google_box__text">请使用Google Authenticator扫码或复制以下密钥</p>
          <QrCode :value="googleInfo.codeurl" :size="200" />
          <div class="google_box__secret">
            <span>密钥：{{ googleInfo.secret }}</span>
            <el-link class="copy_btn" :data-clipboard-text="googleInfo.secret">复制</el-link>
          </div>
        </div>
        <div class="google_box__btns">
          <el-input type="text" placeholder="请输入验证码" style="margin-right: 10px;" v-model="google_code"></el-input>
          <el-button type="danger" v-if="googleInfo.have_secret" @click="_unbindGoogle">解绑</el-button>
          <el-button type="primary" v-else @click="_bindGoogle">绑定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdmin,
  addAdmin,
  saveAdmin,
  deleteAdmin,
  deleteListAdmin,
  stopAdmin,
  stopListAdmin,
  openAdmin,
  openListAdmin,
  getGoogleInfo,
  bindGoogle,
  unbindGoogle,
} from '@/api/system'
import { mapGetters } from 'vuex'
import QrCode from "../../components/QrCode/QrCode.vue";
import ClipboardJS from "clipboard";

export default {
  name: 'admin',
  components: { QrCode },
  data() {
    return {
      google_code: '',
      dialogGoogle: false,
      dialogShow: false,
      dialogShow2: false,
      tableData: [],
      page: 1,
      pagesize: 20,
      meta: {
        total: 0
      },
      activeType: '-1',
      loading: false,
      formData: {
        name: '管理员',
        username: '',
        password: '123456',
        gender: 1,
        phone: '',
        group_id: ''
      },
      updateForm: {},
      formLine: {
        username: '',
        parent: ''
      },
      selectList: [],
      googleInfo: null,
      googleUser: null,
      googleLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'group_id'
    ]),
    groupList() {
      var list = []
      switch (this.group_id) {
        case 0:
          list = [
            {
              value: 0,
              label: '超级管理员'
            },
            {
              value: 1,
              label: '管理员'
            },
            {
              value: 2,
              label: '业务员'
            }
          ];
          break;
        case 1:
          list = [
            {
              value: 1,
              label: '管理员'
            },
            {
              value: 2,
              label: '业务员'
            }
          ];
          break;

      }
      return list;
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    const clipboard = new ClipboardJS('.copy_btn');
    const that = this;
    clipboard.on('success', function (e) {
      that.$message.success('复制成功');
      e.clearSelection();
    });

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  },
  methods: {
    _bindGoogle() {
      if (!this.google_code) {
        this.$message.error('请输入验证码');
        return;
      }
      this.googleLoading = true;
      bindGoogle({
        id: this.googleUser.id,
        code: this.google_code,
        secret: this.googleInfo.secret,
      }).then(({ code, message }) => {
        this.google_code = '';
        this.dialogGoogle = false;
        if (code === 200) {
          this.getList();
          this.$message.success(message);
        } else {
          this.$message.error(message);
        }
        this.googleLoading = false;
      });
    },
    _unbindGoogle() {
      if (!this.google_code) {
        this.$message.error('请输入验证码');
        return;
      }
      this.googleLoading = true;
      unbindGoogle({
        id: this.googleUser.id,
        code: this.google_code,
      }).then(({ code, message }) => {
        this.google_code = '';
        this.dialogGoogle = false;
        if (code === 200) {
          this.getList();
          this.$message.success(message);
        } else {
          this.$message.error(message);
        }
        this.googleLoading = false;
      });
    },
    toggleGoogle(row) {
      this.googleUser = row;
      this._getGoogleInfo(row);
      this.dialogGoogle = true;
    },
    _getGoogleInfo({ id }) {
      getGoogleInfo(id).then(res => {
        this.googleInfo = res.data;
      });
    },
    search() {
      this.page = 1;
      this.getList();
    },
    handleClickTab(val) {
      this.activeType = val;
      this.page = 1;
      this.getList();
    },
    getList() {
      var param = 'page=' + this.page + "&pagesize=" + this.pagesize
        + "&username=" + this.formLine.username + "&parent=" + this.formLine.parent
        + "&group=" + this.activeType;
      this.loading = true;
      getAdmin(param).then(res => {
        this.loading = false;
        this.tableData = res.data;
        this.meta = res.meta;
      }).catch(error => {
        this.loading = false;
      });
    },
    handleCancel() {
      this.dialogShow = false;
      this.resetForm();
    },
    handleCancel2() {
      this.dialogShow2 = false;
      this.updateForm = {};
    },
    handleAdd() {
      this.dialogShow = true;
    },
    handleEdit(row) {
      this.updateForm = {
        id: row.id,
        name: row.name,
        username: row.username,
        gender: row.gender,
        phone: row.phone,
        group_id: row.group_id
      };
      this.dialogShow2 = true;
    },
    resetForm() {
      this.formData = {
        name: '管理员',
        username: '',
        password: '123456',
        gender: 1,
        phone: '',
        group_id: ''
      }
    },
    onSubmitAdd() {
      addAdmin(this.formData).then(res => {
        this.handleCancel();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onSubmitSave() {
      saveAdmin(this.updateForm).then(res => {
        this.handleCancel2();
        this.getList();
        this.$message.success(res.message);
      });
    },
    onDelete(id) {
      this.$confirm('是否将此管理员删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(id).then(res => {
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    handleSelectionChange(val) {
      this.selectList = [];
      for (var i = 0; i < val.length; i++) {
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
    onDeleteList() {
      this.$confirm('是否删除所选择的管理员？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteListAdmin(this.selectList).then(res => {
          this.getList();
          this.$message.success(res.message);
        });
      })
    },
    stopChange(row) {
      if (row.is_stop) {
        stopAdmin(row.id).then(res => {
          this.$message.success(res.message);
        }).catch(error => {
          row.is_stop = false
        })
      } else {
        openAdmin(row.id).then(res => {
          this.$message.success(res.message);
        }).catch(error => {
          row.is_stop = true
        })
      }
    },
    stopList() {
      stopListAdmin(this.selectList).then(res => {
        this.$message.success(res.message);
        this.getList();
      })
    },
    openList() {
      openListAdmin(this.selectList).then(res => {
        this.$message.success(res.message);
        this.getList();
      })
    }
  }
}
</script>

<style scoped>
.google_box__btns {
  display: flex;
  align-items: center;
}

.google_box__secret {
  margin-top: 15px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
}

.google_box__text {
  margin-bottom: 15px;
  font-size: 16px;
}

.google_box {
  text-align: center;
}
</style>

<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.username" placeholder="名称/登陆名/邀请码" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级">
          <el-input v-model="formLine.parent" placeholder="名称/登陆名" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="formLine.id_card" placeholder="姓名/身份证号" clearable></el-input>
        </el-form-item>
        <el-form-item label="认证状态" prop="is_auth">
          <el-select v-model="formLine.is_auth" style="width: 120px;" clearable placeholder="请选择">
            <el-option value="1" label="未认证"></el-option>
            <el-option value="2" label="待审核"></el-option>
            <el-option value="3" label="已认证"></el-option>
            <el-option value="4" label="未通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态" prop="coin_type">
          <el-select v-model="formLine.type" style="width: 100px;" clearable placeholder="请选择">
            <el-option value="1" label="在线"></el-option>
            <el-option value="2" label="离线"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" round>添加会员</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="onDeleteList" round>删除</el-button>
      <el-button type="warning" icon="el-icon-remove-outline" @click="stopList" round>停用</el-button>
      <el-button type="success" icon="el-icon-circle-check" @click="openList" round>启用</el-button>
      <el-button icon="el-icon-s-check" @click="agentList" round>设为代理</el-button>
      <el-button type="info" icon="el-icon-s-custom" @click="agentStopList" round>取消代理</el-button>
      <el-button icon="el-icon-sort" @click="levelSet" round>设置上级</el-button>
      <el-button type="info" icon="el-icon-s-open" @click="clearParent" round>清除上级</el-button>
    </div>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogShow"
      width="500px">
      <el-form :model="formData" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="登陆名称" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="用户等级" prop="coin_type">
          <el-select v-model="formData.level_id" placeholder="请选择">
            <el-option :value="0" label="无"></el-option>
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
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
        <el-form-item label="代理" prop="is_agent">
          <el-switch
            v-model="formData.is_agent">
          </el-switch>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="onSubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogShow2"
      width="500px">
      <el-form :model="updateForm" ref="infoForm" label-width="100px" style="width: 400px;">
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="登陆名称" prop="username">
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户等级" prop="coin_type">
          <el-select v-model="updateForm.level_id" placeholder="请选择">
            <el-option :value="0" label="无"></el-option>
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input v-model="updateForm.password" show-password></el-input>
          不修改密码则不用填
        </el-form-item>
        <el-form-item label="资金密码" prop="pay_password">
          <el-input v-model="updateForm.pay_password" show-password></el-input>
          不修改密码则不用填
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="updateForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="代理" prop="is_agent">
          <el-switch
            v-model="updateForm.is_agent">
          </el-switch>
        </el-form-item>
        <el-form-item label="取款人" prop="real_name">
          <el-input v-model="updateForm.real_name"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="id_card">
          <el-input v-model="updateForm.id_card"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="updateForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="invite_code">
          <el-input v-model="updateForm.invite_code"></el-input>
        </el-form-item>
        <el-form-item label="是否激活" prop="is_paidian">
          <el-switch
            v-model="updateForm.is_paidian">
          </el-switch>
        </el-form-item>
        <el-form-item label="清除谷歌验证" prop="google_secret">
          <el-switch
            v-model="updateForm.clear_google">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2()">取 消</el-button>
        <el-button type="primary" @click="onSubmitSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置用户上级"
      :visible.sync="dialogShow3"
      width="500px">
      <el-form :model="levelForm" ref="levelForm" label-width="100px" style="width: 400px;">
        <el-form-item label="上级用户名" prop="username">
          <el-input v-model="levelForm.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow3=false">取 消</el-button>
        <el-button type="primary" @click="onSubmitLevel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="资金修改"
      :visible.sync="dialogShow4"
      width="500px">
      <el-form :model="moneyForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户" prop="username">
          <el-input v-model="moneyForm.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="moneyForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-model="moneyForm.type" label="1">余额</el-radio>
          <el-radio v-model="moneyForm.type" label="2">冻结</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="moneyForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow4=false">取 消</el-button>
        <el-button type="primary" @click="onSubmitMoney">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改理财钱包余额"
      :visible.sync="dialogShow7"
      width="500px">
      <el-form :model="licaiForm" ref="moneyForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户" prop="username">
          <el-input v-model="licaiForm.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="num">
          <el-input v-model="licaiForm.num"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow7=false">取 消</el-button>
        <el-button type="primary" @click="onSubmitLicai">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置团队标识"
      :visible.sync="dialogShow5"
      width="500px">
      <el-form :model="flagForm" ref="levelForm" label-width="100px" style="width: 400px;">
        <el-form-item label="团队标识" prop="username">
          <el-input v-model="flagForm.team_flag"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow5=false">取 消</el-button>
        <el-button type="primary" @click="onSubmitFlag">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <div class="page-tab-box">
        <el-radio-group v-model="activeType" @change="handleClickTab">
          <el-radio-button label="0">所有类型</el-radio-button>
          <el-radio-button label="1">普通会员</el-radio-button>
          <el-radio-button label="2">代理用户</el-radio-button>
        </el-radio-group>
      </div>

      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          fixed="left"
          label="用户"
          min-width="230">
          <template slot-scope="{row}">
            <div style="display: flex;align-items: center;">
              <el-avatar :size="50" :src="row.avatar ? row.avatar : 'images/head.jpg'"></el-avatar>
              <div style="margin-left: 10px;">
                <div style="font-weight: bold;"><el-link type="primary" @click="openDrawer(row)">{{row.username}}</el-link><el-tag v-if="row.level" size="mini" effect="dark" style="margin-left: 10px;font-weight: 500;font-style: italic;">{{row.level.title}}</el-tag>
                  <el-tag type="success" size="mini" v-if="row.google_secret">谷歌</el-tag><el-tag type="info" size="mini" v-else>谷歌</el-tag>
                </div>
                <div style="color: #5a5e66;font-size: 10px;">{{row.name}}</div>
                <div>
                  <el-tag type="success" size="mini" v-if="row.is_online">在线</el-tag><el-tag type="info" size="mini" v-else>离线</el-tag>
                  <el-tag type="success" size="mini" v-if="row.is_paidian">已激活</el-tag><el-tag type="info" size="mini" v-else>未激活</el-tag>
                  <el-tag type="success" size="mini" v-if="row.is_auth == 3">已认证</el-tag>
                  <el-tag size="mini" v-else-if="row.is_auth < 3">待审核</el-tag>
                  <el-tag type="danger" size="mini" v-else-if="row.is_auth == 4">未通过</el-tag>
                  <el-tag type="info" size="mini" v-else>未认证</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="team_flag"
          label="团队标识"
          align="center"
          min-width="80">
          <template slot-scope="{row}">
            <div style="font-weight: bold;">{{row.team_flag}}</div>
            <div>
              <el-link @click="handleFlag(row)" type="primary">修改</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="team_level"
          label="团队层级"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="money"
          label="账户余额"
          align="center"
          min-width="120">
          <template slot-scope="{row}">
            <div style="color: chocolate">￥ {{row.money}}</div>
            <div style="color: #7d838e;font-size: 12px;">冰结:￥ {{row.frozen}}</div>
            <div>
              <el-link @click="handleMoney(row)" type="primary">修改</el-link>
              <el-link @click="handleChange(row)" type="primary" style="margin-left: 10px;">账变</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="licai"
          label="理财账户"
          align="center"
          min-width="120">
          <template slot-scope="{row}">
            <div style="color: chocolate">{{row.licai}}</div>
            <div>
              <el-link @click="handleLicai(row)" type="primary">修改</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="invite_code"
          label="邀请码"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="real_name"
          align="center"
          label="真实姓名"
          width="110">
          <template slot-scope="{row}">
            {{row.real_name ? row.real_name : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="id_card"
          align="center"
          label="身份证号"
          width="180">
          <template slot-scope="{row}">
            {{row.id_card ? row.id_card : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="genderName"
          label="性别"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          label="联系电话"
          width="110">
          <template slot-scope="{row}">
            {{row.phone ? row.phone : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="parent"
          label="上级会员"
          align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="is_agent"
          label="代理"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_agent" @change="agentChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_stop"
          label="停用"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_stop" @change="stopChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="stop_out"
          label="禁止提现"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.stop_out" @change="outChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="stop_trade"
          label="禁止交易"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.stop_trade" @change="tradeChange(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="stop_transfer"
          label="禁止转账"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.stop_transfer" @change="transferChange(row)">
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
      <div class="pagination-box">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagesize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="meta.total">
        </el-pagination>
      </div>
    </el-card>
    <el-drawer
      title="用户详情"
      :visible.sync="showDrawer"
      :with-header="false"
      direction="rtl"
      size="80%">
      <el-container style="height: 100vh;">
        <el-aside width="300px" style="padding:0 20px;background: #F1F1F1;">
          <div class="drawer-row"><b>用户：</b>{{nowUser.username}}</div>
          <div class="drawer-row"><b>真实姓名：</b>{{nowUser.real_name}}</div>
          <div class="drawer-row"><b>注册时间：</b>{{nowUser.created_at}}</div>
          <div class="drawer-row"><b>上级会员：</b>{{nowUser.parent}}</div>
          <div class="drawer-row"><b>所在团队：</b>{{nowUser.team_flag}}</div>
          <div class="drawer-row"><b>团队层级：</b>{{nowUser.team_level}}</div>
          <div class="drawer-row"><b>邀请码：</b>{{nowUser.invite_code}}</div>
          <div class="drawer-row" v-for="(item,index) in nowUser.coinList"><b>{{item.coin}}余额：</b>{{item.num}}</div>
        </el-aside>
        <el-container>
          <el-header style="background: #F1F1F1;">
            <div style="padding: 10px 0;">
              <el-radio-group v-model="activeType1" @change="handleClickTab1">
                <el-radio-button label="0">资产流水</el-radio-button>
              </el-radio-group>
            </div>
          </el-header>
          <el-main>
            <div class="search-box">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="用户">
                  <el-input v-model="formLine2.name" placeholder="用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="转账人">
                  <el-input v-model="formLine2.from_user" placeholder="转账人用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="关键词">
                  <el-input v-model="formLine2.keyword" placeholder="关键词" clearable></el-input>
                </el-form-item>
                <el-form-item label="币种" prop="coin_id">
                  <el-select v-model="formLine2.coin_id" clearable placeholder="请选择">
                    <el-option
                      v-for="item in coinList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formLine2.date"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search1()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table
              :data="tableData1"
              border
              v-loading="loading1"
              style="width: 100%">
              <el-table-column
                prop="coin"
                label="币种"
                align="center"
                width="80">
              </el-table-column>
              <el-table-column
                prop="num"
                label="数量"
                width="140">
                <template slot-scope="{row}">
                  <div style="color: #44aa77" v-if="row.flag">+{{row.num}}</div>
                  <div style="color: #dd1100" v-else>{{row.num}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="num"
                label="冻结"
                width="140">
                <template slot-scope="{row}">
                  <div style="color: #44aa77" v-if="row.flag2">+{{row.frozen}}</div>
                  <div style="color: #dd1100" v-else>{{row.frozen}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="before_num"
                label="账变前"
                width="140">
              </el-table-column>
              <el-table-column
                prop="after_num"
                label="账变后"
                width="140">
              </el-table-column>
              <el-table-column
                prop="typeName"
                label="类型"
                align="center"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="admin"
                label="管理员"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="from_user"
                label="转账人"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="created_at"
                width="160"
                label="创建时间">
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer style="background: #F1F1F1;">
            <div class="pagination-box">
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="pagesize1"
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page.sync="page1"
                :total="meta1.total">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-drawer>
  </div>
</template>

<script>
import {
  getUserList,
  addUser,
  saveUser,
  deleteUser,
  deleteListUser,
  stopUser,
  stopListUser,
  openUser,
  openListUser,
  agentUser,
  agentListUser,
  agentStopUser,
  agentStopListUser,
  setParent,
  clearParent,
  setMoney,
  setLicai,
  getLevelList,
  setFlag,
  stopOut,
  openOut,
  openTrade,
  stopTransfer,
  openTransfer,
  stopTrade
} from '@/api/user'
import {getChangeList} from '@/api/usercoin'

  export default {
    name: 'list',
    data(){
      return {
        dialogShow:false,
        dialogShow2:false,
        dialogShow3:false,
        dialogShow4:false,
        dialogShow5:false,
        dialogShow7:false,
        showDrawer:false,
        tableData: [],
        page:1,
        pagesize:20,
        meta:{
          total:0
        },
        activeType:'0',
        loading:false,
        formData:{
          name:'',
          username:'',
          level_id:'',
          password:'123456',
          gender:1,
          phone:'',
          is_agent:false,
        },
        updateForm:{

        },
        nowUser:{},
        formLine:{
          username:'',
          parent:'',
          id_card: '',
          type:'',
          is_auth:''
        },
        formLine2:{
          name:'',
          keyword:'',
          coin_id:'',
          from_user:'',
          date:null
        },
        levelForm:{
          username:''
        },
        moneyForm:{
          id:0,
          username:'',
          amount:'',
          type:'1',
          remark:''
        },
        licaiForm:{
          id:0,
          username:'',
          num:''
        },
        flagForm:{},
        selectList:[],
        levelList:[],
        activeType1:0,
        loading1:false,
        tableData1: [],
        page1:1,
        pagesize1:20,
        meta1:{
          total:0
        },
      }
    },
    created() {
      this.getLevelList()
      this.getList()
    },
    activated() {
      this.getLevelList()
    },
    methods:{
      getLevelList(){
        getLevelList().then(res=>{
          this.levelList = res.data
        })
      },
      search(){
        this.page = 1;
        this.getList();
      },
      handleClickTab(val){
        this.activeType = val;
        this.page = 1;
        this.getList();
      },

      handleClickTab1(val){
        this.activeType1 = val;
        this.page1 = 1;
        this.tableData1 = [];
        this.meta1 = {total: 0};
        if (val == 0){
          this.getChangeList();
        }

      },
      getList(){
        var param = 'page='+this.page+"&pagesize="+this.pagesize
          +"&username="+this.formLine.username+"&parent="+this.formLine.parent+'&id_card='+this.formLine.id_card
          +"&type="+this.activeType+'&online='+this.formLine.type+'&is_auth='+this.formLine.is_auth;
        this.loading = true;
        getUserList(param).then(res=>{
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
      levelSet(){
        this.dialogShow3 = true;
        this.levelForm = {
          username:''
        };
      },
      handleAdd(){
        var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var name = '';
        for(var i=0;i<10;i++){
          var index = parseInt(Math.random()*str.length);
          name += str.substr(index,1);
        }
        this.formData.name = name;
        this.dialogShow = true;
      },
      handleEdit(row){
        this.updateForm = {
          id:row.id,
          name:row.name,
          username:row.username,
          real_name:row.real_name,
          id_card:row.id_card,
          level_id:row.level_id,
          gender:row.gender,
          phone:row.phone,
          password:'',
          pay_password:'',
          is_agent:row.is_agent,
          invite_code:row.invite_code,
          is_paidian:row.is_paidian,
          clear_google:false
        };
        this.dialogShow2 = true;
      },
      /**
       * 设置资金窗口
       */
      handleMoney(row){
        this.dialogShow4 = true;
        this.moneyForm = {
          id:row.id,
          username:row.username,
          amount:'',
          type:'1',
          remark:''
        }
      },
      handleLicai(row){
        this.dialogShow7 = true;
        this.licaiForm = {
          id:row.id,
          username: row.username,
          num:row.licai
        }
      },
      handleFlag(row){
        this.dialogShow5 = true;
        this.flagForm = {
          id:row.id,
          team_flag:row.team_flag
        }
      },
      handleChange(row){
        this.$router.push({
          path:"/user/change",
          query:{
            username:row.username
          }
        });
      },
      resetForm(){
        this.formData = {
          name:'',
          username:'',
          password:'123456',
          gender:1,
          phone:'',
          is_agent:false,
          group_id:''
        }
      },
      onSubmitAdd(){
        addUser(this.formData).then(res=>{
          this.handleCancel();
          this.getList();
          this.$message.success(res.message);
        });
      },
      onSubmitSave(){
        saveUser(this.updateForm).then(res=>{
          this.handleCancel2();
          this.getList();
          this.$message.success(res.message);
        });
      },
      onDelete(id){
        this.$confirm('是否将此用户删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(res=>{
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
      onDeleteList(){
        this.$confirm('是否删除所选择的用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteListUser(this.selectList).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      agentChange(row){
        if(row.is_agent){
          agentUser(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.is_agent = false
          })
        }else{
          agentStopUser(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.is_agent = true
          })
        }
      },
      stopChange(row){
        if(row.is_stop){
          stopUser(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.is_stop = false
          })
        }else{
          openUser(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.is_stop = true
          })
        }
      },
      outChange(row){
        if(row.stop_out){
          stopOut(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.stop_out = false
          })
        }else{
          openOut(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.stop_out = true
          })
        }
      },
      tradeChange(row){
        if(row.stop_trade){
          stopTrade(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.stop_trade = false
          })
        }else{
          openTrade(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.stop_trade = true
          })
        }
      },
      transferChange(row){
        if(row.stop_transfer){
          stopTransfer(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.stop_transfer = false
          })
        }else{
          openTransfer(row.id).then(res=>{
            this.$message.success(res.message);
          }).catch(error=>{
            row.stop_transfer = true
          })
        }
      },
      stopList(){
        if(this.selectList.length == 0){
          this.$message.warning("请至少选择一条数据");
          return;
        }
        stopListUser(this.selectList).then(res=>{
          this.$message.success(res.message);
          this.getList();
        })
      },
      openList(){
        if(this.selectList.length == 0){
          this.$message.warning("请至少选择一条数据");
          return;
        }
        openListUser(this.selectList).then(res=>{
          this.$message.success(res.message);
          this.getList();
        })
      },
      agentList(){
        if(this.selectList.length == 0){
          this.$message.warning("请至少选择一条数据");
          return;
        }
        agentListUser(this.selectList).then(res=>{
          this.$message.success(res.message);
          this.getList();
        })
      },
      agentStopList(){
        if(this.selectList.length == 0){
          this.$message.warning("请至少选择一条数据");
          return;
        }
        agentStopListUser(this.selectList).then(res=>{
          this.$message.success(res.message);
          this.getList();
        })
      },
      onSubmitLevel(){
        if(this.selectList.length == 0){
          this.$message.warning("请至少选择一个需要设置上级的用户");
          return;
        }
        setParent({list:this.selectList,username:this.levelForm.username}).then(res=>{
          this.$message.success(res.message);
          this.dialogShow3 = false;
          this.getList();
        })
      },
      clearParent(){
        if(this.selectList.length == 0){
          this.$message.warning("请至少选择一条数据");
          return;
        }
        this.$confirm('是否清除所选用户的上级关联？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          clearParent(this.selectList).then(res=>{
            this.$message.success(res.message);
            this.getList();
          })
        });
      },
      /**
       * 设置资金
       */
      onSubmitMoney(){
        setMoney(this.moneyForm).then(res=>{
          this.dialogShow4 = false;
          this.getList();
          this.$message.success(res.message);
        });
      },
      onSubmitLicai(){
        setLicai(this.licaiForm).then(res=>{
          this.dialogShow4 = false;
          this.getList();
          this.$message.success(res.message);
        });
      },
      onSubmitFlag(){
        setFlag(this.flagForm).then(res=>{
          this.dialogShow5 = false;
          this.getList();
          this.$message.success(res.message);
        });
      },
      openDrawer(row){
        this.showDrawer = true;
        this.nowUser = row;
        this.handleClickTab1(0);
      },
      search1(){
        this.page1 = 1;
        this.getChangeList();
      },
      getChangeList(){
        this.loading1 = true;
        var param = "user_id="+this.nowUser.id+"&pagesize="+this.pagesize1+"&page="+this.page1
          +"&name="+this.formLine2.name+"&from_user="+this.formLine2.from_user
          +"&coin_id="+this.formLine2.coin_id + "&keyword="+this.formLine2.keyword;
        if(this.formLine2.date){
          param += "&start="+this.formLine2.date[0]+"&end="+this.formLine2.date[1]
        }

        getChangeList(param).then(res=>{
          this.loading1 = false;
          this.tableData1 = res.data;
          this.meta1 = res.meta;
        }).catch(error=>{
          this.loading1 = false;
        });
      },
      handleSizeChange1(val) {
        this.pagesize1 = val;
        if (this.activeType1 == 0){
          this.getChangeList();
        }
      },
      handleCurrentChange1(val) {
        this.page1 = val;
        if (this.activeType1 == 0){
          this.getChangeList();
        }
      },
      getOutList(){
        this.loading1 = true;
        getList("user_id="+this.nowUser.id+"&pagesize="+this.pagesize1+"&page="+this.page1).then(res=>{
          this.loading1 = false;
          this.tableData1 = res.data;
          this.meta1 = res.meta;
        }).catch(error=>{
          this.loading1 = false;
        });
      }
    }
  }
</script>

<style scoped>
.drawer-row{
  color: #333333;
  font-size: 12px;
  padding: 10px 0px;
}
</style>

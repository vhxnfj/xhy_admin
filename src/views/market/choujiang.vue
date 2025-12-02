<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="formLine.keyword" placeholder="输入关键词" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-box">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" round>添加活动</el-button>
      <span style="margin-left: 20px;font-size: 12px;color: #999999;">app页面/pages/choujiang/choujiang?id=ID号</span>
    </div>
    <el-dialog
      title="抽奖活动"
      :visible.sync="dialogShow"
      width="750px">
      <el-form :model="dataForm" ref="moneyForm" label-width="100px" style="width: 650px;">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="created_at">
          <el-date-picker
            v-model="dataForm.start_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="created_at">
          <el-date-picker
            v-model="dataForm.end_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抽奖价格" prop="price">
          <el-input v-model="dataForm.price" style="width: 100px"></el-input> U/次，0或小于0表示免费抽取
        </el-form-item>
        <el-form-item label="第日次数" prop="times">
          <el-input v-model="dataForm.times" style="width: 100px"></el-input> 次，0或小于0表示不限制
        </el-form-item>
        <el-form-item label="奖励起始量" prop="start_bonus">
          <el-input v-model="dataForm.start_bonus" style="width: 100px"></el-input> USDT
        </el-form-item>
        <el-form-item label="奖励结束量" prop="end_bonus">
          <el-input v-model="dataForm.end_bonus" style="width: 100px"></el-input> USDT
        </el-form-item>
        <el-form-item label="奖励制度">
          <div style="padding:5px;" v-for="(item,index) in dataForm.bonus_nodes">
            购买第<el-input v-model="item.times" style="width: 100px"></el-input>次，奖励<el-input v-model="item.num" style="width: 100px"></el-input>- <el-input v-model="item.end_num" style="width: 100px"></el-input> USDT
            <el-button @click="deleteBonus(index,dataForm.bonus_nodes)" type="danger" size="small">删除</el-button>
          </div>
          <div>
            <el-button @click="addBonusRule()">添加规则</el-button>
          </div>
        </el-form-item>
        <el-form-item label="礼包中奖概率" prop="gift_chance">
          <el-input v-model="dataForm.gift_chance" style="width: 100px"></el-input> %
        </el-form-item>
        <el-form-item label="礼包制度">
          <div style="padding:5px;" v-for="(item,index) in dataForm.gift_nodes">
            奖励<el-input v-model="item.start_num" style="width: 100px"></el-input>
            - <el-input v-model="item.end_num" style="width: 100px"></el-input>个
            <el-select v-model="item.coin_id" style="width: 100px;" placeholder="请选择">
              <el-option
                v-for="item in coinList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <el-button @click="addGiftRule()">添加规则</el-button>
          </div>
        </el-form-item>
        <el-form-item label="活动说明" prop="info">
          <el-input v-model="dataForm.info" type="textarea" :rows="10"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch v-model="dataForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="submiting" :loading="submiting">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="app-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="80"
          fixed="left"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="title"
          min-width="160"
          fixed="left"
          label="活动标题">
        </el-table-column>
        <el-table-column
          prop="start_at"
          width="160"
          label="活动时间">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">开始时间：</div><div>{{row.start_at}}</div>
            <div style="font-size: 12px;color: #42b983;">结束时间：</div><div>{{row.end_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="参与价格">
          <template slot-scope="{row}">
            {{row.price}} USDT
          </template>
        </el-table-column>
        <el-table-column
          prop="times"
          label="每日次数">
        </el-table-column>
        <el-table-column
          prop="start_bonus"
          label="奖励起始量">
          <template slot-scope="{row}">
            {{row.start_bonus}} USDT
          </template>
        </el-table-column>
        <el-table-column
          prop="end_bonus"
          label="奖励结束量">
          <template slot-scope="{row}">
            {{row.end_bonus}} USDT
          </template>
        </el-table-column>
        <el-table-column
          prop="gift_chance"
          label="礼物获得概率">
          <template slot-scope="{row}">
            {{row.gift_chance}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.status">启用</el-tag>
            <el-tag type="info" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="时间"
          width="160">
          <template slot-scope="{row}">
            <div style="font-size: 12px;color: #20a0ff;">创建时间：</div><div>{{row.created_at}}</div>
            <div style="font-size: 12px;color: #42b983;">最后修改：</div><div>{{row.updated_at}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          width="260"
          label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row.id)">删除</el-button>
            <el-button size="small" @click="onRecord(row.id)">领取记录</el-button>
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
          :current-page.sync="page"
          :total="meta.total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="活动领取记录" width="800px" :visible.sync="dialogTableVisible">
      <div>领取次数：{{gridData.length}}次，发放：{{tongji_amount}}USDT</div>
      <el-table :data="gridData" v-loading="gridLoading">
        <el-table-column property="name" label="昵称" width="140"></el-table-column>
        <el-table-column property="username" label="用户名" width="180"></el-table-column>
        <el-table-column property="coin" label="领取币种"></el-table-column>
        <el-table-column property="amount" label="领取数量" width="200"></el-table-column>
        <el-table-column property="created_at" label="领取时间" width="180"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {coinSelectList} from '@/api/coin'
  import {getList,addChoujiang,updateChoujiang,deleteChoujian,getRecords} from '@/api/choujiang'

  export default {
    name: 'choujiang',
    data(){
      return {
        formLine:{
          keyword:''
        },
        tableData: [],
        page:1,
        pagesize:20,
        meta:{
          total:0
        },
        activeType:'0',
        loading:false,
        dialogShow:false,
        submiting:false,
        dataForm:{

        },
        dialogTableVisible:false,
        gridData:[],
        gridLoading:false
      }
    },
    created() {
      if(this.$route.query.username){
        this.formLine.username = this.$route.query.username;
      }
      this.getList();
      this.getCoinList();
    },
    activated() {
      this.getCoinList();
    },
    computed:{
      tongji_amount(){
        var list = this.gridData,total = 0.0;
        list.forEach(item=>{
          if(item.coin == 'USDT'){
            total += item.amount;
          }
        })
        return Math.round(total*100000000)/100000000;
      }
    },
    methods:{
      addBonusRule(){
        this.dataForm.bonus_nodes.push({times:'',num:'',end_num:''});
      },
      deleteBonus(index,data){
        data.splice(index,1);
      },
      addGiftRule(){
        this.dataForm.gift_nodes.push({start_num:'',end_num:'',coin_id:''});
      },
      getCoinList(){
        coinSelectList().then(res=>{
          this.coinList = res.data
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
      getList(){
        var param = 'page='+this.page+"&pagesize="+this.pagesize +"&keyword="+this.formLine.keyword;
        this.loading = true;
        getList(param).then(res=>{
          this.loading = false;
          this.tableData = res.data;
          this.meta = res.meta;
        }).catch(error=>{
          this.loading = false;
        });
      },
      handleSizeChange(val) {
        this.pagesize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      onRecord(id){
        this.dialogTableVisible = true;
        this.gridData = [];
        this.gridLoading = true;
        getRecords(id).then(res=>{
          this.gridLoading = false;
          this.gridData = res.data;
        }).catch(error =>{
          this.gridLoading = false;
        })
      },
      handleAdd(){
        this.dataForm = {
          title:'',
          start_at:'',
          end_at:'',
          price:'',
          start_bonus:'',
          end_bonus:'',
          gift_chance:'',
          bonus_nodes:[],
          gift_nodes:[],
          times:'',
          info:'',
          status:1
        };
        this.dialogShow = true;
      },
      handleEdit(row){
        this.dataForm = {
          id:row.id,
          title:row.title,
          price:row.price,
          start_at:row.start_at,
          end_at:row.end_at,
          start_bonus:row.start_bonus,
          end_bonus:row.end_bonus,
          bonus_nodes:row.bonus_nodes,
          gift_nodes:row.gift_nodes,
          gift_chance:row.gift_chance,
          times:row.times,
          info:row.info,
          status:row.status
        };
        this.dialogShow = true;
      },
      onChangeStatus(row){
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
      onDelete(id){
        this.$confirm('是否删除此活动？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteChoujiang(id).then(res=>{
            this.getList();
            this.$message.success(res.message);
          });
        })
      },
      onSubmit(){
        this.submiting = true;
        if(this.dataForm.id){
          updateChoujiang(this.dataForm).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.getList();
            this.$message.success(res.message);
          }).catch(error=>{
            this.submiting = false;
          });
        }else{
          addChoujiang(this.dataForm).then(res=>{
            this.submiting = false;
            this.dialogShow = false;
            this.getList();
            this.$message.success(res.message);
          }).catch(error=>{
            this.submiting = false;
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>

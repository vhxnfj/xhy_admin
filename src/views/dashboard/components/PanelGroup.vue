<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日注册
          </div>
          <count-to :start-val="0" :end-val="data.register.today" :duration="2600" class="card-panel-num" />
          <div class="card-sub-text"><b>总注册:</b>{{data.register.total}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="recharge1" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日充值
          </div>
          <div>
            <span class="card-panel-num">{{data.recharge.today}}</span>
            <span class="card-sub-text">/{{data.recharge.count}}笔</span>
          </div>
          <div class="card-sub-text"><b>新增用户充值:</b>{{data.recharge.newuser}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col" v-if="data.recharge_money">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="recharge1" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日充值人民币
          </div>
          <div>
            <span class="card-panel-num">{{data.recharge_money.today}}</span>
            <span class="card-sub-text">/{{data.recharge_money.count}}笔</span>
          </div>
          <div class="card-sub-text"><b>新增用户充值:</b>{{data.recharge_money.newuser}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="out1" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日提现
          </div>
          <count-to :start-val="0" :end-val="data.out.today" :duration="2600" class="card-panel-num" />
          <div class="card-sub-text"><b>待提现:</b>{{data.out.waiting}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="transfer" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总充值
          </div>
          <div class="card-panel-num">
            <div class="card-panel-num">{{data.totalInfo.recharge}}</div>
          </div>
          <div class="card-sub-text"><b>总提现:</b>{{data.totalInfo.out}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="miner" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            矿机产出
          </div>
          <div class="card-panel-num">{{data.miner.product}}</div>
          <div class="card-sub-text"><b>矿机总量:</b>{{data.miner.total}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="paidian" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日消费
          </div>
          <count-to :start-val="0" :end-val="data.paidian.today" :duration="2600" class="card-panel-num" />
          <div class="card-sub-text"><b>昨日:</b>{{data.paidian.yesterday}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="trade" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            代理返点
          </div>
          <div class="card-panel-num">{{data.fandian.today}}</div>
          <div class="card-sub-text"><b>昨日:</b>{{data.fandian.yesterday}}</div>
        </div>
      </div>
    </el-col>
    <el-col :sm="12" :md="12" :lg="8"  :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="trade" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            产生收益
          </div>
          <div class="card-panel-num">{{data.profit.today}}</div>
          <div class="card-sub-text"><b>昨日:</b>{{data.profit.yesterday}}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { indexCount } from '@/api/system'

export default {
  name:"panelgroup",
  components: {
    CountTo
  },
  data(){
    return {
      data:{
        miner: {product: 0, total: 0},
        out: {today: 0, waiting: 0},
        paidian: {today: 0, yesterday: 0},
        profit: {today: 0, yesterday: 0},
        recharge: {today: 0,count:0, newuser: 0},
        recharge_money: {today: 0,count:0, newuser: 0},
        register: {today: 0, total: 0},
        platCoinTj: {money:0, name: "-", total: 0},
        fandian: {today: 0, yesterday: 0},
        totalInfo:{recharge:0,out:0}
      },
      timer:null
    }
  },
  created() {
    this.getCountData()
    this.timer = setInterval(()=>{
      this.getCountData()
    },30000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getCountData(){
      indexCount().then(res=>{
        this.data = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    min-height: 118px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      text-align: right;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.card-sub-text{
  text-align: right;
  padding-top: 10px;
}
</style>

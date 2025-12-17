<script src="../../../../4hao_u_admin/src/router/index.js"></script>
<template>
  <div>
    <sticky class="form-sticky-bar" style="z-index: 999;" :sticky-top="80">
      <el-button type="primary" icon="el-icon-success" @click="onSubmit" :loading="saving"
        :disabled="saving">保存</el-button>
    </sticky>
    <div class="app-container">
      <el-form label-width="180px" :model="formData">
        <el-tabs type="border-card">
          <el-tab-pane label="基本设置">
            <el-form-item label="平台名称">
              <el-input v-model="formData.webname" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="平台标题">
              <el-input v-model="formData.webtitle" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="短信签名">
              <el-input v-model="formData.sms_sign" style="width: 100px;"></el-input> 如短信内容为：<span
                style="color: #20a0ff;">【淘宝】您的验证码为:123。</span>则填：淘宝
            </el-form-item>
            <el-form-item label="平台结算币种">
              <el-input v-model="formData.account_coin" style="width: 100px;"></el-input> 如：人民币则填 CNY，美元则填 USD
            </el-form-item>
            <el-form-item label="结算币种名称">
              <el-input v-model="formData.account_coin_name" style="width: 100px;"></el-input> 如：人民币、美元等
            </el-form-item>
            <el-form-item label="结算币种符号">
              <el-input v-model="formData.account_coin_sign" style="width: 100px;"></el-input> 如：￥、$等
            </el-form-item>
            <el-form-item label="客服地址">
              <el-input v-model="formData.service_url" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="用户协议地址">
              <el-input v-model="formData.reg_article_url" style="width: 400px;"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="用户注册">
            <el-form-item label="新用户注册">
              赠送 <el-input v-model="formData.reg_give" style="width: 100px;"></el-input> 个
              <el-select v-model="formData.reg_give_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select> 币
            </el-form-item>
            <el-form-item label="邀请一个用户">
              赠送 <el-input v-model="formData.invite_give" style="width: 100px;"></el-input> 个
              <el-select v-model="formData.invite_give_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select> 币
            </el-form-item>
            <el-form-item label="邀请用户首充" v-if="0">
              赠送 <el-input v-model="formData.invite_recharge_give" style="width: 100px;"></el-input> 个
              <el-select v-model="formData.invite_recharge_give_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select> 币
            </el-form-item>
            <el-form-item label="邀请注册地址">
              <el-input v-model="formData.reg_url" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="邀请注册说明">
              <el-input type="textarea" rows="5" v-model="formData.invite_content" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="代理奖励制度">
              <div>一级代理<el-input v-model="formData.invite_bonus_1" style="width: 100px;"></el-input>%</div>
              <div style="margin-top:10px;">二级代理<el-input v-model="formData.invite_bonus_2"
                  style="width: 100px;"></el-input>%</div>
              <div style="margin-top:10px;">三级代理<el-input v-model="formData.invite_bonus_3"
                  style="width: 100px;"></el-input>%</div>
              <div style="margin-top:10px;">四级代理<el-input v-model="formData.invite_bonus_4"
                  style="width: 100px;"></el-input>%</div>
              <div style="margin-top:10px;">五级代理<el-input v-model="formData.invite_bonus_5"
                  style="width: 100px;"></el-input>%</div>
            </el-form-item>
            <el-form-item label="白名单手机验证码">
              <el-input v-model="formData.white_code" style="width: 100px;"></el-input> 默认123456
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="业务配置">
            <el-form-item label="策略手续费返现比例">
              <el-input v-model="formData.strategy_fee_rebates_rate" style="width: 100px;"></el-input> %
            </el-form-item>
            <el-form-item label="资产页文章栏标题">
              <el-input v-model="formData.article_cate" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="资产页文章数量">
              <el-input v-model="formData.article_count" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="平台主币币种" prop="trade_coin">
              <el-select v-model="formData.web_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易使用币种" prop="trade_coin">
              <el-select v-model="formData.trade_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手续费币种" prop="fee_coin">
              <el-select v-model="formData.fee_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="币种互兑规则">
              <el-input v-model="formData.exchange" style="width: 400px;" type="textarea"></el-input>
              <div>示例：USDT=BTC,表示 USDT可换BTC，多个用"|"隔开</div>
            </el-form-item>
            <el-form-item label="合约交易">
              最大 <el-input v-model="formData.trade_max_count" style="width: 100px;"></el-input> 手/次
            </el-form-item>
            <el-form-item label="合约交易">
              收取 <el-input v-model="formData.trade_fee" style="width: 100px;"></el-input> %，手续费
            </el-form-item>
            <el-form-item label="网格交易">
              最低 <el-input v-model="formData.grid_min_num" style="width: 100px;"></el-input> USDT
            </el-form-item>
            <el-form-item label="网格交易">
              最大 <el-input v-model="formData.grid_max_count" style="width: 100px;"></el-input> 手/次
            </el-form-item>
            <el-form-item label="网格交易">
              收取 <el-input v-model="formData.grid_fee" style="width: 100px;"></el-input> %，手续费
            </el-form-item>
            <el-form-item label="现货交易">
              收取 <el-input v-model="formData.coin_trade_fee" style="width: 100px;"></el-input> %，手续费
            </el-form-item>
            <el-form-item label="现货交易">
              失败机率 <el-input v-model="formData.coin_trade_faild" style="width: 100px;"></el-input> %，不填则全部成功
            </el-form-item>
            <el-form-item label="理财钱包">
              每小时收益<el-input v-model="formData.licai_rate" style="width: 100px;"></el-input> %
            </el-form-item>
            <el-form-item label="活动佣金">
              总共领取 <el-input v-model="formData.total_get_reward" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="开启矿机">
              需直推达到 <el-input v-model="formData.miner_level" style="width: 100px;"></el-input> 人
            </el-form-item>
            <el-form-item label="购买理财">
              需直推达到 <el-input v-model="formData.licai_level" style="width: 100px;"></el-input> 人
            </el-form-item>

            <el-form-item label="OTC质押矿机价格">
              <el-input v-model="formData.otc_miner_price" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="OTC每日挂单">
              <el-input v-model="formData.otc_max_trade_num" style="width: 100px;"></el-input>笔
            </el-form-item>
            <el-form-item label="OTC挂单数">
              <el-input v-model="formData.otc_shop_min_num" style="width: 100px;"></el-input> - <el-input
                v-model="formData.otc_shop_max_num" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="商户浮动范围">
              <el-input v-model="formData.otc_shop_float" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="用户浮动范围">
              <el-input v-model="formData.otc_float" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="OTC最低购买量">
              <el-input v-model="formData.otc_min_buy_num" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="OTC手续费规则">
              <el-input type="textarea" :rows="8" v-model="formData.otc_fee_rule" style="width: 300px;"></el-input>
              <br />如：<300=5表示小于和等于300手续费为5GUSD，>300=2表示大于和等于300手续费为2GUSD，每行一个规则
            </el-form-item>
            <!--
            <el-form-item label="可交易币种" prop="trade_list">
              <el-checkbox-group v-model="formData.trade_list">
                <el-checkbox v-for="item in coinList"
                             :key="'trade'+item.value"
                             :label="item.value+''">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="交易最小币数">
              <el-input v-model="formData.trade_min" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="交易手续费费率">
              <el-input v-model="formData.trade_rate" style="width: 100px;"></el-input> %
            </el-form-item>
            -->
          </el-tab-pane>
          <el-tab-pane label="借贷功能">
            <el-form-item label="使用借贷">
              需直推达到 <el-input v-model="formData.borrow_level" style="width: 100px;"></el-input> 人
            </el-form-item>
            <el-form-item label="借贷质押率">
              <el-input v-model="formData.borrow_rate" style="width: 100px;"></el-input> %
            </el-form-item>
            <el-form-item label="借贷利率">
              <el-input type="textarea" :rows="5" v-model="formData.borrow_day_rate" style="width: 200px;"></el-input>
              <div>格式为30=0.5，表示借贷30天，日利率为0.5%，可多行设置，每一行为一个设置项</div>
            </el-form-item>
            <el-form-item label="借贷须知">
              <el-input type="textarea" :rows="18" v-model="formData.borrow_text" style="width: 500px;"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="充值相关">
            <el-form-item label="充值金额可选值">
              <el-input v-model="formData.rechargeValue" style="width: 400px;"></el-input> 多个值之间用半角逗号隔开，例：100,200,300
            </el-form-item>
            <el-form-item label="最低充值金额">
              <el-input v-model="formData.min_recharge" style="width: 150px;"></el-input> 元
            </el-form-item>
            <el-form-item label="最高充值金额">
              <el-input v-model="formData.max_recharge" style="width: 150px;"></el-input> 元
            </el-form-item>
            <el-form-item label="充值USDT价格">
              <el-input v-model="formData.recharge_price" style="width: 150px;"></el-input> 元
            </el-form-item>
            <el-form-item label="开启USDT直充">
              <el-switch v-model="formData.open_usdt" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="优盾钱包商户号">
              <el-input v-model="formData.merchant_number" style="width: 150px;"></el-input>
            </el-form-item>
            <el-form-item label="优盾钱包币种类型">
              <el-input v-model="formData.coin_type" style="width: 150px;"></el-input>
            </el-form-item>
            <el-form-item label="优盾钱包秘钥">
              <el-input v-model="formData.api_key" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="优盾网关地址">
              <el-input v-model="formData.gateway_address" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="收款账户">
              <el-input v-model="formData.bank_info" style="width: 400px;"></el-input> 格式为(逗号使用英文逗号)：开户名,银行名,卡号
            </el-form-item>
            <el-form-item label="收款码名称">
              <el-input v-model="formData.qr_name" style="width: 100px;"></el-input> 如：支付宝
            </el-form-item>
            <el-form-item label="收款码">
              <el-upload class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
                accept="image/*" :data="{ name: 'qr_url' }" :on-success="handleUploadSuccess"
                :on-error="handelUploadError">
                <img v-if="formData.qr_url" :src="formData.qr_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="充值页提示">
              <el-input type="textarea" :rows="8" v-model="formData.recharge_text" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="充值页提示ERC20">
              <el-input type="textarea" :rows="8" v-model="formData.recharge_text2" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="BTC收款地址">
              <el-input v-model="formData.btc_addr" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="充值页提示BTC">
              <el-input type="textarea" :rows="8" v-model="formData.recharge_text3" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="ETH收款地址">
              <el-input v-model="formData.eth_addr" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="充值页提示ETH">
              <el-input type="textarea" :rows="8" v-model="formData.recharge_text4" style="width: 400px;"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="提现相关">
            <el-form-item label="最低提现金额">
              <el-input v-model="formData.min_out" style="width: 150px;"></el-input> 元
            </el-form-item>
            <el-form-item label="最高提现金额">
              <el-input v-model="formData.max_out" style="width: 150px;"></el-input> 元
            </el-form-item>
            <el-form-item label="提现USDT价">
              <el-input v-model="formData.out_price" style="width: 150px;"></el-input> 元
            </el-form-item>
            <el-form-item label="提现手续费">
              <el-input v-model="formData.out_fee_rate" style="width: 100px;"></el-input> %
            </el-form-item>
            <el-form-item label="手续费规则">
              <el-input type="textarea" :rows="8" v-model="formData.out_fee_rule" style="width: 300px;"></el-input>
              <br />如：<300=5表示小于和等于300手续费为5GUSD，>300=2表示大于和等于300手续费为2GUSD，每行一个规则
            </el-form-item>
            <el-form-item label="单日提现次数">
              <el-input v-model="formData.out_times" style="width: 150px;"></el-input> 次，不设置则无限制
            </el-form-item>
            <el-form-item label="当日提现">
              <el-input v-model="formData.today_out_times" style="width: 150px;"></el-input> 次后，收取手续费
              (设置为0或不设置，则每次提现都收取手续费，设置成负数后表示不收手续费)
            </el-form-item>
            <el-form-item label="新添加银行卡">
              <el-input v-model="formData.card_update_limit" style="width: 150px;"></el-input> 小时内不可提现，不设置则无限制
            </el-form-item>
            <el-form-item label="最大绑卡数">
              <el-input v-model="formData.max_card" style="width: 150px;"></el-input> 张，不设置则无限制
            </el-form-item>
            <el-form-item label="提现页提示">
              <el-input type="textarea" :rows="8" v-model="formData.out_text" style="width: 400px;"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="签到相关">
            <el-form-item label="签到周期" prop="sign_days">
              <el-select v-model="formData.sign_days" style="width: 100px;" clearable placeholder="请选择">
                <el-option v-for="item in 14" :key="item" :label="item" :value="item + ''">
                </el-option>
              </el-select>
              天
            </el-form-item>
            <el-form-item label="每日签到">
              赠送 <el-input v-model="formData.sign_day_give" style="width: 100px;"></el-input> 个
              <el-select v-model="formData.sign_day_give_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select> 币
            </el-form-item>
            <el-form-item label="每日递规则">
              <el-input v-model="formData.sign_day_give_rule" style="width: 150px;"></el-input>
              如需要每天领取数比前一天多2枚则为+2，支持加号+和乘号*
            </el-form-item>
            <el-form-item label="签到结束">
              赠送 <el-input v-model="formData.sign_give" style="width: 100px;"></el-input> 个
              <el-select v-model="formData.sign_give_coin" clearable placeholder="请选择">
                <el-option v-for="item in coinList" :key="item.value" :label="item.label" :value="item.value + ''">
                </el-option>
              </el-select> 币
            </el-form-item>
            <el-form-item label="签到提示">
              <el-input v-model="formData.sign_tip" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="活动规则">
              <el-input type="textarea" :rows="8" v-model="formData.sign_event" style="width: 400px;"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="矿机相关">
            <el-form-item label="每日可自行加速">
              <el-input v-model="formData.free_up_times" style="width: 100px;"></el-input> 次
            </el-form-item>
            <el-form-item label="自行加速">
              <el-input v-model="formData.free_up_time" style="width: 100px;"></el-input> 分钟/次
            </el-form-item>
            <el-form-item label="邀请用户可加速">
              <el-input v-model="formData.help_up_time" style="width: 100px;"></el-input> 分钟/次
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="任务系统">
            <el-form-item label="邀请任务" v-if="0">
              <el-input v-model="formData.invite_task" type="textarea" rows="4" style="width: 400px;"></el-input>
              <div>每行为一条任务，任务格式为：1=10，表示邀请1个人奖励10个币</div>
            </el-form-item>
            <el-form-item label="首次购买矿机" v-if="0">
              奖励 <el-input v-model="formData.first_buy_miner" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="每日量化交易" v-if="0">
              奖励 <el-input v-model="formData.buy_contract" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="每日矿机购买" v-if="0">
              奖励 <el-input v-model="formData.buy_miner" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="完成身份认证">
              赠送 <el-input v-model="formData.reg_auth_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="首次充值满">
              <el-input v-model="formData.first_recharge_num" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.first_recharge_give" style="width: 100px;"></el-input> 个币
            </el-form-item>

            <el-form-item label="当日完成交易">
              赠送 <el-input v-model="formData.first_buy_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日邀请好友">
              赠送 <el-input v-model="formData.today_invite_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="首次交易">
              金额满 <el-input v-model="formData.first_trade_num" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.first_trade_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日充值满">
              <el-input v-model="formData.today_recharge_num_1" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.today_recharge_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日充值满">
              <el-input v-model="formData.today_recharge_num_2" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.today_recharge_give_2" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日充值满">
              <el-input v-model="formData.today_recharge_num_3" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.today_recharge_give_3" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日充值满">
              <el-input v-model="formData.today_recharge_num_4" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.today_recharge_give_4" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="直推达到">
              <el-input v-model="formData.day_invite" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.day_invite_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="直推达到">
              <el-input v-model="formData.day_invite_1" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.day_invite_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="直推达到">
              <el-input v-model="formData.day_invite_2" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.day_invite_give_2" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="直推达到">
              <el-input v-model="formData.day_invite_3" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.day_invite_give_3" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="团队人数">
              <el-input v-model="formData.team_total_count" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.team_count_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="团队人数">
              <el-input v-model="formData.team_total_count_1" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.team_count_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="团队人数">
              <el-input v-model="formData.team_total_count_2" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.team_count_give_2" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="团队人数">
              <el-input v-model="formData.team_total_count_3" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.team_count_give_3" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日交易满">
              <el-input v-model="formData.today_trade_num" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.today_trade_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当日交易满">
              <el-input v-model="formData.today_trade_num_1" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.today_trade_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当月交易满">
              <el-input v-model="formData.month_trade_num" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.month_trade_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              盈利达到<el-input v-model="formData.ai_trade_win_num_1" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_win_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              盈利达到<el-input v-model="formData.ai_trade_win_num_2" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_win_give_2" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              盈利达到<el-input v-model="formData.ai_trade_win_num_3" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_win_give_3" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              盈利达到<el-input v-model="formData.ai_trade_win_num_4" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_win_give_4" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              交易金额达到<el-input v-model="formData.ai_trade_num_1" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              交易金额达到<el-input v-model="formData.ai_trade_num_2" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_give_2" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              交易金额达到<el-input v-model="formData.ai_trade_num_3" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_give_3" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="智能合约">
              交易金额达到<el-input v-model="formData.ai_trade_num_4" style="width: 100px;"></el-input>USDT,赠送 <el-input
                v-model="formData.ai_trade_give_4" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="交易">
              满<el-input v-model="formData.trade_days_1" style="width: 100px;"></el-input>天,赠送 <el-input
                v-model="formData.trade_days_give_1" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="交易">
              满<el-input v-model="formData.trade_days_2" style="width: 100px;"></el-input>天,赠送 <el-input
                v-model="formData.trade_days_give_2" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当周直推" v-if="0">
              <el-input v-model="formData.week_invite" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.week_invite_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="当月直推" v-if="0">
              <el-input v-model="formData.month_invite" style="width: 100px;"></el-input>人，奖励 <el-input
                v-model="formData.month_invite_give" style="width: 100px;"></el-input> 个币
            </el-form-item>
            <el-form-item label="任务说明">
              <el-input v-model="formData.task_content" type="textarea" rows="6" style="width: 400px;"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {getConfig,saveConfig} from '@/api/system'
  import {coinSelectList} from '@/api/coin'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'setting',
    components: { Sticky },
    data(){
      return {
        saving:false,
        uploadUrl:process.env.VUE_APP_BASE_API + 'config/upload',
        headers:{
          Authorization:'Bearer '+getToken()
        },
        formData:{
          trade_list:[],
          out_coin_list:[],
          webname:'',
          webtitle:'',
          sms_sign:'',
          account_coin:'',
          account_coin_sign:'',
          trade_rate:'',
          account_coin_name:'',
          web_coin:'',
          trade_coin:'',
          fee_coin:'',
          reg_give:'',
          reg_give_coin:'',
          invite_give:'',
          invite_give_coin:'',
          invite_recharge_give:'',
          invite_recharge_give_coin:'',
          reg_auth_give:'',
          trade_min:'',
          out_min:'',
          out_rate:'',
          integral_rate:'',
          reg_url:'',
          service_url:'',
          reg_article_url:'',
          sign_days:'',
          sign_tip:'',
          sign_event:'',
          sign_give:'',
          sign_give_coin:'',
          sign_day_give:'',
          sign_day_give_coin:'',
          sign_day_give_rule:'',
          rechargeValue:'',
          min_recharge:'',
          max_recharge:'',
          bank_info:'',
          qr_name:'',
          qr_url:'',
          recharge_text:'',
          recharge_text2:'',
          btc_addr:'',
          recharge_text3:'',
          eth_addr:'',
          recharge_text4:'',
          open_usdt:'0',
          merchant_number:'',
          coin_type:'',
          api_key:'',
          gateway_address:'',
          min_out:'',
          max_out:'',
          out_times:'',
          today_out_times:'',
          card_update_limit:'',
          max_card:'',
          out_text:'',
          free_up_times:'',
          free_up_time:'',
          help_up_time:'',
          strategy_fee_rebates_rate:'',
          article_cate:'',
          article_count:'',
          invite_task:'',
          first_buy_miner:'',
          buy_contract:'',
          buy_miner:'',
          day_invite:'',
          day_invite_give:'',
          day_invite_1:'',
          day_invite_give_1:'',
          day_invite_2:'',
          day_invite_give_2:'',
          day_invite_3:'',
          day_invite_give_3:'',
          team_total_count:'',
          team_count_give:'',
          team_total_count_1:'',
          team_count_give_1:'',
          team_total_count_2:'',
          team_count_give_2:'',
          team_total_count_3:'',
          team_count_give_3:'',
          today_trade_num:'',
          today_trade_give:'',
          today_trade_num_1:'',
          today_trade_give_1:'',
          month_trade_num:'',
          month_trade_give:'',
          week_invite:'',
          week_invite_give:'',
          month_invite:'',
          month_invite_give:'',
          task_content:'',
          white_code:'',
          invite_content:'',
          invite_bonus_1:'',
          invite_bonus_2:'',
          invite_bonus_3:'',
          invite_bonus_4:'',
          invite_bonus_5:'',
          licai_rate:'',
          trade_max_count:'',
          trade_fee:'',
          total_get_reward:'',
          miner_level:'',
          licai_level:'',
          borrow_level:'',
          out_fee_rate:'',
          first_recharge_num:'',
          first_recharge_give:'',
          first_buy_give:'',
          today_invite_give:'',
          today_recharge_num_1:'',
          today_recharge_give_1:'',
          today_recharge_num_2:'',
          today_recharge_give_2:'',
          today_recharge_num_3:'',
          today_recharge_give_3:'',
          today_recharge_num_4:'',
          today_recharge_give_4:'',
          grid_fee:'',
          out_fee_rule:'',
          exchange:'',
          grid_max_count:'',
          grid_min_num:'',
          otc_fee_rule:'',
          otc_max_trade_num:'',
          otc_miner_price:'',
          otc_min_buy_num:'',
          otc_shop_min_num:'',
          otc_shop_max_num:'',
          otc_shop_float:'',
          otc_float:'',
          coin_trade_fee:'',
          coin_trade_faild:'',
          borrow_rate:'',
          borrow_day_rate:'',
          borrow_text:'',
          recharge_price:'',
          out_price:'',
          first_trade_num:'',
          first_trade_give:'',
          ai_trade_win_num_1:'',
          ai_trade_win_num_2:'',
          ai_trade_win_num_3:'',
          ai_trade_win_num_4:'',
          ai_trade_win_give_1:'',
          ai_trade_win_give_2:'',
          ai_trade_win_give_3:'',
          ai_trade_win_give_4:'',
          ai_trade_num_1:'',
          ai_trade_num_2:'',
          ai_trade_num_3:'',
          ai_trade_num_4:'',
          ai_trade_give_1:'',
          ai_trade_give_2:'',
          ai_trade_give_3:'',
          ai_trade_give_4:'',
          trade_days_1:'',
          trade_days_2:'',
          trade_days_give_1:'',
          trade_days_give_2:''
        },
        coinList:[]
      }
    },
    created() {
      this.loadInfo();
      this.getCoinList();
    },
    activated() {
      this.loadInfo();
      this.getCoinList();
    },
    methods:{
      getCoinList(){
        coinSelectList().then(res=>{
          this.coinList = res.data
        })
      },
      loadInfo(){
        getConfig().then(res=>{
          var list = ["trade_list","out_coin_list"]
          for (var item in res){
            if(list.indexOf(item) != -1 && res[item]){
              res[item] = res[item].split(",")
            }
            this.formData[item] = res[item]
          }
        })
      },
      onSubmit(){
        this.saving = true;
        saveConfig(this.formData).then(res=>{
          this.saving =false;
          this.$message.success("数据保存成功！");
        }).catch(error=>{
          this.saving = false;
        });
      },
      handleUploadSuccess(res,file){
        var data = res.data;
        var formData = this.formData;
        this.formData = [];
        formData[data.name] = data.url;
        this.formData = formData;
      },
      handelUploadError(err, file, fileList){
        this.$message.error(JSON.parse(err.message).message)
      }
    }
  }
</script>

<style scoped></style>

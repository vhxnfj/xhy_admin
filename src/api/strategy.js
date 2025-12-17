import request from "@/utils/request";

// 策略配置管理

// 策略配置列表
export function getStrategyConfigList(query) {
  return request({
    url: "/strategy-config/list",
    method: "get",
    params: query
  });
}

// 币种选项列表
export function getStrategyConfigCoinOptions(query) {
  return request({
    url: "/strategy-config/coin-options",
    method: "get",
    params: query
  });
}

// 策略配置详情
export function getStrategyConfigDetail(id) {
  return request({
    url: "/strategy-config/" + id,
    method: "get"
  });
}

// 添加策略配置
export function addStrategyConfig(data) {
  return request({
    url: "/strategy-config/add",
    method: "post",
    data
  });
}

// 修改策略配置
export function updateStrategyConfig(data) {
  return request({
    url: "/strategy-config/update",
    method: "post",
    data
  });
}

// 删除策略配置
export function deleteStrategyConfig(id) {
  return request({
    url: "/strategy-config/" + id,
    method: "delete"
  });
}

// 启用/禁用
export function toggleStrategyConfigStatus(data) {
  return request({
    url: "/strategy-config/toggle-status",
    method: "post",
    data
  });
}

// 设置盈利状态
export function setStrategyConfigProfit(data) {
  return request({
    url: "/strategy-config/set-profit",
    method: "post",
    data
  });
}

// 批量启用/禁用
export function batchToggleStrategyConfigStatus(data) {
  return request({
    url: "/strategy-config/batch-toggle-status",
    method: "post",
    data
  });
}

// 批量删除
export function batchDeleteStrategyConfig(data) {
  return request({
    url: "/strategy-config/batch-delete",
    method: "post",
    data
  });
}

// 策略订单管理

// 策略订单列表
export function getStrategyOrderList(query) {
  return request({
    url: "/strategy-order/list",
    method: "get",
    params: query
  });
}

// 统计数据
export function getStrategyOrderStatistics(query) {
  return request({
    url: "/strategy-order/statistics",
    method: "get",
    params: query
  });
}

// 订单详情
export function getStrategyOrderDetail(id) {
  return request({
    url: "/strategy-order/" + id,
    method: "get"
  });
}

// 强制平仓
export function forceCloseStrategyOrder(data) {
  return request({
    url: "/strategy-order/force-close",
    method: "post",
    data
  });
}

// 强制爆仓
export function forceLiquidateStrategyOrder(data) {
  return request({
    url: "/strategy-order/force-liquidate",
    method: "post",
    data
  });
}

// 修改订单盈亏
export function updateStrategyOrderPnl(data) {
  return request({
    url: "/strategy-order/update-pnl",
    method: "post",
    data
  });
}

// 删除订单
export function deleteStrategyOrder(id) {
  return request({
    url: "/strategy-order/" + id,
    method: "delete"
  });
}

// 批量强制平仓
export function batchForceCloseStrategyOrder(data) {
  return request({
    url: "/strategy-order/batch-force-close",
    method: "post",
    data
  });
}

// 批量删除
export function batchDeleteStrategyOrder(data) {
  return request({
    url: "/strategy-order/batch-delete",
    method: "post",
    data
  });
}

// 执行收益
export function executeStrategyProfit(id) {
  return request({
    url: "/strategy-config/execute-profit/" + id,
    method: "get"
  });
}

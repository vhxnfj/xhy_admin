import request from '@/utils/request'

export function getTradeList(params){
  return request.get("trade/list?"+params)
}

export function getTradeTongji(params){
  return request.get("trade/tongji?"+params)
}

export function getTransList(params){
  return request.get("trade/transfer?"+params)
}

export function getExchangeList(params){
  return request.get("trade/exchange?"+params)
}

export function getTradeOrder(id){
  return request.get("trade/order/"+id)
}

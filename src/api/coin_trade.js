import request from '@/utils/request'

export function getList(param){
  return request.get("coin_trade/list?"+param)
}

export function successTrade(id){
  return request.get("coin_trade/do_success/"+id)
}

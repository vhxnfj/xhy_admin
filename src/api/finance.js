import request from '@/utils/request'

export function getWalletList(params){
  return request.get("out/wallet?"+params)
}

export function deleteWallet(id){
  return request.delete("out/wallet/"+id)
}

export function doSuccess(id){
  return request.put("finance/do_out/"+id)
}

export function doDaifu(id){
  return request.put("finance/do_out_daifu/"+id)
}

export function doRefuse(id){
  return request.put("finance/do_out_refuse/"+id)
}

export function getRechargeList(params){
  return request.get("finance/recharge?"+params)
}

export function getRechargeTongji(params){
  return request.get("finance/recharge_tj?"+params)
}

export function getOutList(params){
  return request.get("finance/out?"+params)
}

export function getOutTongji(params){
  return request.get("finance/out_tongji?"+params)
}

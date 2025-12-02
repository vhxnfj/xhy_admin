import request from '@/utils/request'

export function getList(param){
  return request.get("contract_order/list?"+param)
}

export function getTongji(param){
  return request.get("contract_order/tongji?"+param)
}

export function doPaid(data){
  return request.post("contract_order/paid",data)
}

export function doOrder(data){
  return request.post("contract_order/do_order",data)
}

export function getContractList(){
  return request.get("contract/tablist")
}

export function getContractSelect(){
  return request.get("contract/select")
}

export function successContract(id){
  return request.get("contract_order/success/"+id)
}

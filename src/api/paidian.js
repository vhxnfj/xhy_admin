
import request from '@/utils/request'

export function getList(param){
  return request.get("paidian/list?"+param)
}

export function getChildren(id){
  return request.get("paidian/children/"+id)
}

export function addPaidianCoin(data){
  return request.post("paidian/add/coin",data)
}

export function addPaidianListCoin(data){
  return request.post("paidian/list/coin",data)
}

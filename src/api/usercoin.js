import request from '@/utils/request'

export function getList(param){
  return request.get("usercoin/list?"+param)
}

export function getListTotal(param){
  return request.get("usercoin/total?"+param)
}

export function getChangeList(param){
  return request.get("usercoin/changeList?"+param)
}

export function coinAdd(data){
  return request.post("usercoin/add",data)
}

export function coinUpdate(data){
  return request.post("usercoin/update",data)
}

export function clearAddr(id){
  return request.get("usercoin/clear/"+id)
}

export function clearList(data){
  return request.post("usercoin/clearList",{list:data})
}

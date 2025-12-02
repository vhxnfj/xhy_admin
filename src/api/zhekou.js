import request from '@/utils/request'

export function getList(param){
  return request.get("zhekou/list?"+param)
}

export function getRecords(id){
  return request.get("zhekou/record?"+id)
}

export function addZhekou(data){
  return request.post("zhekou/add",data)
}

export function updateZhekou(data){
  return request.post("zhekou/update",data)
}

export function deleteZhekou(id){
  return request.delete("zhekou/"+id)
}


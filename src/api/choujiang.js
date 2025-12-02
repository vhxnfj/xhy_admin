import request from '@/utils/request'

export function getList(param){
  return request.get("choujiang/list?"+param)
}

export function getRecords(id){
  return request.get("choujiang/record/"+id)
}

export function addChoujiang(data){
  return request.post("choujiang/add",data)
}

export function updateChoujiang(data){
  return request.post("choujiang/update",data)
}

export function deleteChoujiang(id){
  return request.delete("choujiang/"+id)
}


import request from '@/utils/request'

export function getList(param){
  return request.get("activity/list?"+param)
}

export function addActivity(data){
  return request.post("activity/add",data)
}

export function updateActivity(data){
  return request.post("activity/update",data)
}

export function getRecords(id){
  return request.get("activity/records/"+id)
}

export function deleteActivity(id){
  return request.delete("activity/"+id)
}

export function open(id){
  return request.put("activity/open/"+id)
}

export function stop(id){
  return request.get("activity/stop/"+id)
}

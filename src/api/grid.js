import request from '@/utils/request'

export function getList(param){
  return request.get("grid/list?"+param)
}

export function addGrid(data){
  return request.post("grid/add",data)
}

export function updateGrid(data){
  return request.post("grid/update",data)
}

export function deleteGrid(id){
  return request.delete("grid/"+id)
}

export function deleteListGrid(data){
  return request.post("grid/drop",{list:data})
}

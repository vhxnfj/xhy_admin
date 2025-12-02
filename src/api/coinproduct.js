import request from '@/utils/request'

export function getList(param){
  return request.get("coinproduct/list?"+param)
}

export function getSelectList(){
  return request.get("coinproduct/select")
}

export function addProduct(data){
  return request.post("coinproduct/add",data)
}

export function updateProduct(data){
  return request.post("coinproduct/update",data)
}

export function deleteProduct(id){
  return request.delete("coinproduct/"+id)
}

export function deleteListProduct(data){
  return request.post("coinproduct/drop",{list:data})
}

export function open(id){
  return request.put("coinproduct/open/"+id)
}

export function stop(id){
  return request.get("coinproduct/stop/"+id)
}

export function openList(data){
  return request.post("coinproduct/open",{list:data})
}

export function stopList(data){
  return request.post("coinproduct/stop",{list:data})
}

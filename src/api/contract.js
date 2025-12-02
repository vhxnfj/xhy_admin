import request from '@/utils/request'

export function getList(param){
  return request.get("contract/list?"+param)
}

export function addProduct(data){
  return request.post("contract/add",data)
}

export function updateProduct(data){
  return request.post("contract/update",data)
}

export function deleteProduct(id){
  return request.delete("contract/"+id)
}

export function deleteListProduct(data){
  return request.post("contract/drop",{list:data})
}

export function open(id){
  return request.put("contract/open/"+id)
}

export function stop(id){
  return request.get("contract/stop/"+id)
}

export function flagOn(id){
  return request.put("contract/flagOn/"+id)
}

export function flagOff(id){
  return request.get("contract/flagOff/"+id)
}

export function openList(data){
  return request.post("contract/open",{list:data})
}

export function stopList(data){
  return request.post("contract/stop",{list:data})
}

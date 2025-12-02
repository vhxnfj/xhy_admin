import request from '@/utils/request'

export function getList(param){
  return request.get("shop/list?"+param)
}

export function addShop(form) {
  return request.post("shop/add",form)
}

export function updateShop(form) {
  return request.post("shop/update",form)
}

export function deleteShop(id){
  return request.delete("shop/"+id)
}


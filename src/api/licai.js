import request from '@/utils/request'

export function getList(param){
  return request.get("licai/list?"+param)
}

export function addLicai(form) {
  return request.post("licai/add",form)
}

export function updateLicai(form) {
  return request.post("licai/update",form)
}

export function deleteLicai(id){
  return request.delete("licai/"+id)
}


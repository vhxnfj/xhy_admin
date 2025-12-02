import request from '@/utils/request'

export function addPhone(data) {
  return request.post("phone/add",data)
}

export function updatePhone(data) {
  return request.post("phone/update",data)
}

export function getPhoneList(param) {
  return request.get("phone/list?"+param)
}

export function deletePhone(id) {
  return request.get("phone/delete/"+id)
}

export function deletePhoneList(data) {
  return request.post("phone/delete",data)
}


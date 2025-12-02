import request from '@/utils/request'

export function addApp(data) {
  return request.post("app/add",data)
}

export function updateApp(data) {
  return request.post("app/update",data)
}

export function getApp(param) {
  return request.get("app/list?"+param)
}

export function deleteApp(id) {
  return request.get("app/delete/"+id)
}

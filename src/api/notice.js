import request from '@/utils/request'

export function addNotice(data) {
  return request.post("notice/add",data)
}

export function updateNotice(data) {
  return request.post("notice/update",data)
}

export function getNotice(param) {
  return request.get("notice/list?"+param)
}

export function deleteNotice(id) {
  return request.get("notice/delete/"+id)
}

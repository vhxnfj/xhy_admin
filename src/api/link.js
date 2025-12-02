import request from '@/utils/request'

export function addLink(data) {
  return request.post("link/add",data)
}

export function updateLink(data) {
  return request.post("link/update",data)
}

export function getLink(param) {
  return request.get("link/list?"+param)
}

export function deleteLink(id) {
  return request.get("link/delete/"+id)
}

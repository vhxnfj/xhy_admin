import request from '@/utils/request'

export function getConfig() {
  return request({
    url: 'config',
    method: 'get'
  })
}

export function saveConfig(form) {
  return request.post("config/save",form)
}

export function getAdmin(param) {
  return request.get("admin/list?"+param);
}

export function addAdmin(form) {
  return request.post("admin/add",form)
}

export function saveAdmin(form) {
  return request.post("admin/save",form)
}

export function deleteAdmin(id) {
  return request.get("admin/delete/"+id)
}
export function deleteListAdmin(list) {
  return request.post("admin/delete",{list:list})
}

export function stopAdmin(id) {
  return request.get("admin/stop/"+id)
}
export function stopListAdmin(list) {
  return request.post("admin/stop",{list:list})
}
export function openAdmin(id) {
  return request.get("admin/open/"+id)
}
export function openListAdmin(list) {
  return request.post("admin/open",{list:list})
}

export function getLog(param) {
  return request.get("log?"+param);
}


export function indexCount(){
  return request.get("index/count")
}

export function globalData(){
  return request.get("global")
}

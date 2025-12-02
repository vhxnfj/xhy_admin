import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'info',
    method: 'get'
  })
}

export function alterPassword(form) {
  return request.post("alter_password",form)
}

export function alterInfo(form) {
  return request.post("alterInfo",form)
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function getUserList(param) {
  return request.get("user/list?"+param);
}

export function addUser(form) {
  return request.post("user/add",form)
}

export function saveUser(form) {
  return request.post("user/save",form)
}

export function deleteUser(id) {
  return request.get("user/delete/"+id)
}

export function deleteListUser(list) {
  return request.post("user/delete",{list:list})
}

export function stopUser(id) {
  return request.get("user/stop/"+id)
}
export function stopListUser(list) {
  return request.post("user/stop",{list:list})
}
export function openUser(id) {
  return request.get("user/open/"+id)
}
export function openListUser(list) {
  return request.post("user/open",{list:list})
}

export function agentUser(id) {
  return request.get("user/agent/"+id)
}
export function agentListUser(list) {
  return request.post("user/agent",{list:list})
}
export function agentStopUser(id) {
  return request.get("user/agent_stop/"+id)
}
export function agentStopListUser(list) {
  return request.post("user/agent_stop",{list:list})
}
export function setParent(data) {
  return request.post("user/parent",data)
}
export function clearParent(list) {
  return request.post("user/parent/clear",{list:list})
}
export function setMoney(data) {
  return request.post("user/money",data)
}
export function setLicai(data) {
  return request.post("user/licai",data)
}
export function getUserChangeList(param) {
  return request.get("user/change?"+param);
}
export function getLevelList() {
  return request.get("level/option");
}

export function setFlag(data) {
  return request.post("user/flag",data)
}

export function stopOut(id) {
  return request.get("user/stop_out/"+id)
}

export function openOut(id) {
  return request.get("user/open_out/"+id)
}

export function stopTrade(id) {
  return request.get("user/stop_trade/"+id)
}

export function openTrade(id) {
  return request.get("user/open_trade/"+id)
}

export function stopTransfer(id) {
  return request.get("user/stop_transfer/"+id)
}

export function openTransfer(id) {
  return request.get("user/open_transfer/"+id)
}

export function getAuthList(param) {
  return request.get("auth/list?"+param)
}

export function setAuth(data) {
  return request.post("auth",data)
}

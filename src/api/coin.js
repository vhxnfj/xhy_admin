import request from '@/utils/request'

export function getList(param){
  return request.get("coin/list?"+param)
}

export function coinSelectList(){
  return request.get("coin/select")
}

export function addCoin(form) {
  return request.post("coin/add",form)
}

export function updateCoin(form) {
  return request.post("coin/update",form)
}

export function deleteCoin(id){
  return request.delete("coin/"+id)
}

export function deleteListCoin(data){
  return request.post("coin/drop",{list:data})
}

export function openRecharge(id){
  return request.put("coin/recharge/"+id)
}

export function stopRecharge(id){
  return request.get("coin/recharge/"+id)
}

export function openTransfer(id){
  return request.put("coin/transfer/"+id)
}

export function stopTransfer(id){
  return request.get("coin/transfer/"+id)
}

export function openRechargeList(data){
  return request.post("coin/recharge/open",{list:data})
}

export function stopRechargeList(data){
  return request.post("coin/recharge/stop",{list:data})
}

export function open(id){
  return request.put("coin/open/"+id)
}

export function stop(id){
  return request.get("coin/stop/"+id)
}

export function openHome(id){
  return request.put("coin/home/"+id)
}

export function stopHome(id){
  return request.get("coin/home/"+id)
}

export function openList(data){
  return request.post("coin/open",{list:data})
}

export function stopList(data){
  return request.post("coin/stop",{list:data})
}

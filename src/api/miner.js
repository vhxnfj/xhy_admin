import request from '@/utils/request'

export function getList(param){
  return request.get("miner/list?"+param)
}

export function addMiner(data){
  return request.post("miner/add",data)
}

export function updateMiner(data){
  return request.post("miner/update",data)
}

export function deleteMiner(id){
  return request.delete("miner/"+id)
}

export function deleteListMiner(data){
  return request.post("miner/drop",{list:data})
}

export function open(id){
  return request.put("miner/open/"+id)
}

export function stop(id){
  return request.get("miner/stop/"+id)
}


export function openList(data){
  return request.post("miner/open",{list:data})
}

export function stopList(data){
  return request.post("miner/stop",{list:data})
}

export function getOrderList(param){
  return request.get("miner/order/list?"+param)
}

export function getTongji(param){
  return request.get("miner/order/tongji?"+param)
}

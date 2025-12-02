import request from '@/utils/request'

export function getList(){
  return request.get("level/list")
}

export function addLevel(data){
  return request.post("level/add",data)
}

export function updateLevel(data){
  return request.post("level/update",data)
}

export function open(id){
  return request.put("level/open/"+id)
}
export function deleteLevel(id){
  return request.delete("level/"+id)
}

export function deleteListLevel(data){
  return request.post("level/drop",{list:data})
}


export function stop(id){
  return request.get("level/stop/"+id)
}

export function openList(data){
  return request.post("level/open",{list:data})
}

export function stopList(data){
  return request.post("level/stop",{list:data})
}

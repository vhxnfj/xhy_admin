import request from '@/utils/request'

export function getBank() {
  return request.get("bank/list");
}

export function addBank(data) {
  return request.post("bank/add",data);
}

export function updateBank(data) {
  return request.post("bank/update",data);
}

export function deleteBank(id){
  return request.get("bank/delete/"+id);
}

export function updateStop(id){
  return request.get("bank/stop/"+id);
}

export function updateStart(id){
  return request.get("bank/start/"+id);
}


export function updateSort(data) {
  return request.post("bank/sort",data);
}

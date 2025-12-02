import request from '@/utils/request'

export function getPayment() {
  return request.get("payment/list");
}

export function addPayment(data) {
  return request.post("payment/add",data);
}

export function updatePayment(data) {
  return request.post("payment/update",data);
}

export function deletePayment(id){
  return request.get("payment/delete/"+id);
}

export function updateStop(id){
  return request.get("payment/stop/"+id);
}

export function updateStart(id){
  return request.get("payment/start/"+id);
}


export function updateSort(data) {
  return request.post("payment/sort",data);
}

import request from '@/utils/request'

export function getList(param) {
  return request.get("recharge?"+param);
}

export function getTongji(param) {
  return request.get("recharge_tongji?"+param);
}



export function cancelOrder(id) {
  return request.get("recharge/cancel/"+id);
}

export function doOrder(id) {
  return request.get("recharge/do/"+id);
}

export function doSuccessOrder(id) {
  return request.get("recharge/success/"+id);
}

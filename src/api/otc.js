import request from '@/utils/request'

export function getList(param) {
  return request.get("otc/list?"+param);
}


export function cancelOrder(data) {
  return request.post("otc/cancel",data);
}

export function doOrder(id) {
  return request.get("otc/do/"+id);
}

export function setOrderTop(id) {
  return request.get("otc/top/"+id);
}

export function cancelOrderTop(id) {
  return request.get("otc/d_top/"+id);
}

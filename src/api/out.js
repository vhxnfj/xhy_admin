import request from '@/utils/request'

export function getList(param) {
  return request.get("out?"+param);
}
export function getCashoutList(param) {
  return request.get("cashout/list?"+param);
}


export function getTongji(param) {
  return request.get("out_tongji?"+param);
}

export function cancelOrder(data) {
  return request.post("cashout/cancel",data);
}

export function doOrder(id) {
  return request.get("cashout/do/"+id);
}

export function doDaifu(id) {
  return request.get("cashout/daifu/"+id);
}

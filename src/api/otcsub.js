import request from '@/utils/request'

export function getList(param) {
  return request.get("otcsub/list?"+param);
}
export function getTongji(param) {
  return request.get("otcsub/tongji?"+param);
}


export function cancelOrder(data) {
  return request.post("otcsub/cancel",data);
}

export function doOrder(id) {
  return request.get("otcsub/do/"+id);
}

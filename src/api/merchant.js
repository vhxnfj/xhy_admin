import request from '@/utils/request'

export function getMerchantList(param) {
  return request.get("merchant/list?"+param)
}

export function passMerchant(id) {
  return request.get("merchant/pass/"+id)
}

export function refuseMerchant(data) {
  return request.post("merchant/refuse",data)
}


export function updateMerchant(data) {
  return request.post("merchant/update",data)
}

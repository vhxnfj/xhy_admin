import request from '@/utils/request'

export function getList(param){
  return request.get("borrow/list?"+param)
}

export function repaymentBorrow(id){
  return request.get("borrow/repayment/"+id)
}

export function passBorrow(id){
  return request.get("borrow/pass/"+id)
}

export function refuseBorrow(id){
  return request.get("borrow/refuse/"+id)
}

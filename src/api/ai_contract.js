import request from '@/utils/request'

export function getList(param){
  return request.get("ai_contract/list?"+param)
}

export function getTongji(param){
  return request.get("ai_contract/tongji?"+param)
}

export function doContract(data){
  return request.post("ai_contract/do",data)
}

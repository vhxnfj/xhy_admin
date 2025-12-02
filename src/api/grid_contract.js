import request from '@/utils/request'

export function getList(param){
  return request.get("grid_contract/list?"+param)
}

export function getTongji(param){
  return request.get("grid_contract/tongji?"+param)
}

export function doGrid(data){
  return request.post("grid_contract/do",data)
}

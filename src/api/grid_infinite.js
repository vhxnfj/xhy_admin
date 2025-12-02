import request from '@/utils/request'

export function getList(param){
  return request.get("grid_infinite/list?"+param)
}

export function getTongji(param){
  return request.get("grid_infinite/tongji?"+param)
}

export function doGrid(data){
  return request.post("grid_infinite/do",data)
}

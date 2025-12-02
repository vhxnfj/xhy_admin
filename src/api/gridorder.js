import request from '@/utils/request'

export function getList(param){
  return request.get("gridorder/list?"+param)
}

export function getTongji(param){
  return request.get("gridorder/tongji?"+param)
}

export function doGrid(data){
  return request.post("gridorder/do",data)
}

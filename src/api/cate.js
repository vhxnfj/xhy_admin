import request from '@/utils/request'

export function getCategory() {
  return request.get("cate/list");
}

export function addCategory(data) {
  return request.post("cate/add",data);
}

export function updateCategory(data) {
  return request.post("cate/update",data);
}

export function deleteCategory(id){
  return request.get("cate/delete/"+id);
}

export function updateStop(id){
  return request.get("cate/stop/"+id);
}

export function updateStart(id){
  return request.get("cate/start/"+id);
}


export function updateSort(data) {
  return request.post("cate/sort",data);
}

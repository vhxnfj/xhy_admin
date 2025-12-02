import request from '@/utils/request'

export function addArticle(data) {
  return request.post("article/add",data)
}

export function updateArticle(data) {
  return request.post("article/update",data)
}

export function getArticleList(param) {
  return request.get("article/list?"+param)
}

export function deleteArticle(id) {
  return request.get("article/delete/"+id)
}

export function getArticle(id) {
  return request.get("article/info/"+id)
}

export function stopArticle(id) {
  return request.get("article/stop/"+id)
}

export function openArticle(id) {
  return request.get("article/open/"+id)
}

export function topArticle(id) {
  return request.get("article/top/"+id)
}

export function stopTopArticle(id) {
  return request.get("article/stop_top/"+id)
}

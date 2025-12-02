import request from '@/utils/request'

export function saveLunbo(data) {
  return request.post("lunbo/save",data)
}

export function getLunbo(data) {
  return request.get("lunbo/list",data)
}

export function savePopup(data) {
  return request.post("lunbo/popup",data)
}

export function getPopup(data) {
  return request.get("lunbo/popup")
}

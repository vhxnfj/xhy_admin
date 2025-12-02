import request from '@/utils/request'

export function getList() {
  return request.get("chat/list");
}

export function addChatroom(data) {
  return request.post("chat/add",data);
}

export function updateChatroom(data) {
  return request.post("chat/update",data);
}

export function searchUser(data) {
  return request.post("chat/user",data);
}

export function updateRoomAdmin(data) {
  return request.post("chat/admin",data);
}

export function updateRoomBlack(data) {
  return request.post("chat/black",data);
}

export function deleteChatroom(id){
  return request.get("chat/delete/"+id);
}

export function updateStop(id){
  return request.get("chat/stop/"+id);
}

export function updateStart(id){
  return request.get("chat/start/"+id);
}

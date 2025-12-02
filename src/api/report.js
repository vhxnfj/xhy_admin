import request from '@/utils/request'

export function getGlobal() {
  return request.get("global");
}

export function getChart(param) {
  return request.get("report/chart?"+param);
}

export function getToday() {
  return request.get("report/today");
}

export function getTotal(param) {
  return request.get("report/total?"+param);
}

export function getReportList(param) {
  return request.get("report/list?"+param);
}


export function getTemaReportTotal(param) {
  return request.get("report/team_total?"+param);
}

export function getTemaReport(param) {
  return request.get("report/team?"+param);
}

export function getTeamSubReport(id) {
  return request.get("report/subteam/"+id);
}

export function getMessage(param) {
  return request.get("report/message?"+param);
}
